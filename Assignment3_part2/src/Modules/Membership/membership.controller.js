import sql_connection from "../../../DB/Models/connection.js";
import axios from "axios";

//--------------------------------Statistics APIs---------------------------------------------------------------
//.... 1- Get all revenues of all members..................................

export const getAllRevenuesMember = (req, res, next) => {
  const revenuesQuery = `select SUM(membership_cost) as total_revenues  from membership`;

  sql_connection.execute(revenuesQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(result[0]);
  });
};

//----------------------------------------------------------------------------------------------------------------

//.2- Get the revenues of a specific trainer.

export const getRevenueSpecificTrainer = (req, res, next) => {
  const revenuesQuery = `select trainerId, SUM(membership_cost) as totalRevenues from membership where trainerId=${req.params.id}`;
  sql_connection.execute(revenuesQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.trainerId == null) {
      return res.status(404).json({ message: "Trainer ID not found" });
    }
    return res.json(result[0]);
  });
};

// ----------------------------------------------------------------------------------------------------------------
// 1- Add Member (must be unique)

export const addMember = async (req, res, next) => {
  const {
    name,
    membership_start,
    membership_end,
    membership_cost,
    status,
    trainerId,
    national_id,
    phone,
  } = req.body;

  // check national id naumber is nuber
  if (isNaN(national_id)) {
    return res.status(400).json({ message: "National ID must be a number" });
  }

  // Validation: Check if national_id is exactly 14 digit long
  if (national_id.toString().length !== 14) {
    return res
      .status(400)
      .json({ message: "National ID must be exactly 14 digit long" });
  }
  // check phone naumber is number
  if (isNaN(phone)) {
    return res.status(400).json({ message: "phone number must be a number" });
  }

  // validation phone number the must be 11 digit
  if (phone.toString().length !== 11) {
    return res
      .status(400)
      .json({ message: "Phone number must be exactly 11 digit long" });
  }

  const insertQuery = `
    INSERT INTO membership (name , membership_start , membership_end,membership_cost , status,trainerId,national_id,phone)
    VALUES ('${name}', '${membership_start}' , '${membership_end}' , '${membership_cost}', '${status}', '${trainerId}', '${national_id}', '${phone}')
    `;

  // select by national id to sure the national unique
  const response = await axios.get(
    `http://localhost:3000/member/get-member-by-nationalId?NationalId=${national_id}`
  );
  if (response.data.exists) {
    return res.json({ message: response.data.message });
  }
  // check the trainer id to sure the trainer id is found
  const response2 = await axios.get(
    `http://localhost:3000/member/check_trainerId?trainerId=${trainerId}`
  );
  if (response2.data.exists) {
    return res.json({ message: response2.data.message });
  }
  sql_connection.execute(insertQuery, (err, result) => {
    if (err) {
      return res.json({ message: "Query Error", error: err.message });
    }

    if (!result.affectedRows) {
      return res.json({ message: "Member Not Added" });
    }

    res.json({ message: `Member Added ` });
  });
};
// check National Id
export const getMemberByNationalId = (req, res, next) => {
  const { NationalId } = req.query;
  const selectByNationalId = `
    SELECT national_id FROM membership WHERE national_id  =  '${NationalId}'
    `;
  sql_connection.execute(selectByNationalId, (err, result) => {
    if (err) {
      return res.json({
        message: "Query Error",
        error: err.message,
      });
    }

    if (result.length) {
      return res.json({
        message: "National Id  is already Exists",
        exists: true,
      });
    }

    res.json({ message: `Not found`, exists: false });
  });
};
// -----------------------------------
//check trainer id

export const getTrainerId = (req, res, next) => {
  const { trainerId } = req.query;
  const selectTrainerId = `
    SELECT trainer_id FROM trainer WHERE trainer_id  =  '${trainerId}'
    `;
  sql_connection.execute(selectTrainerId, (err, result) => {
    if (err) {
      return res.json({
        message: "Query Error",
        error: err.message,
      });
    }

    if (result.length) {
      return res.json({ message: `Trainer id already exists`, exists: false });
    }

    res.json({ message: "Trainer Id is not found", exists: true });
  });
};
//-------------------------------------------------------------------------------------------------------------------

// 2- Get all Members and Member’s Trainer

export const getMembers = async (req, res) => {
  try {
    const selectQuery = "select * from membership";
    const memberResult = await new Promise((resolve, reject) => {
      sql_connection.execute(selectQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const memberWithTrainer = [];
    for (const member of memberResult) {
      const trainerDataQuery = `select * from trainer WHERE trainer_id = ${member.trainerId}`;
      const trainerData = await new Promise((resolve, reject) => {
        sql_connection.execute(trainerDataQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      memberWithTrainer.push({
        member: member,
        members_trainers: trainerData[0],
      });
    }

    return res.json({ data: memberWithTrainer });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// ---------------------------------------------------------------------------
// 3- Get a specific Member (if his membership expired return “this member is not allowed to enter the gym”)
export const specificMember = (req, res) => {
  const selectQuery = `SELECT * FROM membership WHERE id = ${req.params.id}`;

  sql_connection.execute(selectQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Membership not found" });
    }

    const membershipData = result[0];

    // // Check if membership has expired
    const currentDate = new Date();
    const membershipEndDate = new Date(membershipData.membership_end);

    if (currentDate > membershipEndDate) {
      return res.status(403).json({
        message:
          "This member is not allowed to enter the gym. Membership has expired.",
      });
    }

    const trainerId = membershipData.trainerId;
    const trainerDataQuery = `SELECT * FROM trainer WHERE trainer_id = ${trainerId}`;

    sql_connection.execute(trainerDataQuery, (err, trainerData) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const data = {
        member: membershipData,
        members_trainer: trainerData[0],
      };

      return res.json({ data: data });
    });
  });
};
//------------------------------------------------------------------------------------------------------------

// 4- Update Member (name,membership, trainer id)

export const updateMember = async (req, res) => {
  const {
    name,
    membership_start,
    membership_end,
    membership_cost,
    trainerId,
    national_id,
    status,
    phone,
  } = req.body;
  let updateQuery = "update membership SET ";
  const updateValues = [];
  // if no update all data is past data
  if (name) {
    updateValues.push(`name = '${name}'`);
  }
  if (membership_start) {
    updateValues.push(`membership_start = '${membership_start}'`);
  }
  if (membership_end) {
    updateValues.push(`membership_end = '${membership_end}'`);
  }
  if (membership_cost) {
    updateValues.push(`membership_cost = '${membership_cost}'`);
  }
  if (trainerId) {
    updateValues.push(`trainerId = '${trainerId}'`);
  }

  //-------------------------------only update name , membership , trainer id ------------------------------------------------------------
  if (status) {
    return res.status(400).json({ message: "Status cannot be updated" });
  }
  if (national_id) {
    return res.status(400).json({ message: "national_id cannot be updated" });
  }
  if (phone) {
    return res.status(400).json({ message: "phone cannot be updated" });
  }

  // check the trainer id to sure the trainer id is found
  const response2 = await axios.get(
    `http://localhost:3000/member/check_trainerId?trainerId=${trainerId}`
  );
  if (response2.data.exists) {
    return res.json({ message: response2.data.message });
  }
  updateQuery += updateValues.join(", ") + ` WHERE id = ${req.params.id}`;
  sql_connection.execute(updateQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "member not found" });
    } else {
      return res.json({ message: "member is updated" });
    }
  });
};
//----------------------------------------------------------------------------------------------------------------------------
//5- Delete Member (soft delete)

export const deleteMember = (req, res) => {


  const deleteQuery = `UPDATE membership SET soft_delete = 'yes_soft_delete' WHERE id = ${req.params.id}`;

  sql_connection.execute(deleteQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    return res.json({ message: "Member is soft deleted" });
  });
};
