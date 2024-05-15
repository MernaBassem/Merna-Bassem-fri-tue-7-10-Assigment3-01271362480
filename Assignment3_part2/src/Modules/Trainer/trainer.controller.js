import sql_connection from "../../../DB/Models/connection.js";

//2. Get all trainers and trainer’s members.

export const getTrainers = async (req, res) => {
  try {
    const selectQuery = "select * from trainer";
    const trainersResult = await new Promise((resolve, reject) => {
      sql_connection.execute(selectQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const trainersWithMembers = [];
    for (const trainer of trainersResult) {
      const memberDataQuery = `select * from membership WHERE trainerId = ${trainer.trainer_id}`;
      const membershipData = await new Promise((resolve, reject) => {
        sql_connection.execute(memberDataQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      trainersWithMembers.push({
        trainer: trainer,
        trainers_members: membershipData,
      });
    }

    return res.json({ data: trainersWithMembers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//---------------------------------------------------------------------------------
//5.Get a specific trainer and trainer’s members


export const specificTrainers = (req, res) => {
  const selectQuery = `select * from trainer where trainer_id = ${req.params.id}`;
  sql_connection.execute(selectQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    //if id not found
    if (result.length === 0) {
      return res.status(404).json({ message: "trainer not found" });
    } else {
      const memberDataQuery = `select * from membership where trainerId = ${req.params.id}`;
      // Execute the query to membership data
      sql_connection.execute(memberDataQuery, (err, membershipData) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const data = {
          trainer: result[0],
          trainers_members: membershipData,
        };
        return res.json({ data: data });
      });
    }
  });
};
//--------------------------------------------------------------------------------

//4. delete specific trainers
export const deleteTrainer = (req, res) => {
  const deleteQuery = `delete  from trainer where trainer_id = ${req.params.id}`;
  sql_connection.execute(deleteQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    //if id not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "tranier not found" });
    } else {
      return res.json({ message: "Trainer deleted successfully" });
    }
  });
};
//--------------------------------------------------------------------
// delete all trainer
export const deleteAllTrainer = (req, res) => {
  const deleteQuery = "delete from trainer";
  sql_connection.execute(deleteQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    // if not found
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "trainer table is empty" });
    } else {
      return res.json({ message: "All trainer deleted successfully" });
    }
  });
};
//------------------------------------------------------------

// 3. update trainer
export const updateTrainer = (req, res) => {
  const { trainer_name, trainer_duration_start, trainer_duration_end } = req.body;
  let updateQuery = "update trainer SET ";
  const updateValues = [];
  // if no update all data is past data
  if (trainer_name) {
    updateValues.push(`trainer_name = '${trainer_name}'`);
  }
  if (trainer_duration_start) {
    updateValues.push(`trainer_duration_start = '${trainer_duration_start}'`);
  }
  if (trainer_duration_end) {
    updateValues.push(`trainer_duration_end = '${trainer_duration_end}'`);
  }
  updateQuery += updateValues.join(", ") + ` WHERE trainer_id = ${req.params.id}`;
  sql_connection.execute(updateQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "trainer not found" });
    } else {
      return res.json({ message: "trainer is updated" });
    }
  });
};
//-----------------------------------------------------------------------------------------
// 1- Add a trainer.

export const addTrainer = (req, res) => {
  const { trainer_name, trainer_duration_start, trainer_duration_end } =
    req.body;
  const addQuery = `insert into trainer (trainer_name, trainer_duration_start, trainer_duration_end)
                      VALUES ('${trainer_name}', '${trainer_duration_start}', '${trainer_duration_end}')`;
  sql_connection.execute(addQuery,(err,result)=>{
    if(err){
      return res.status(500).json({error:err.message})
    }
    return res.json({ message: "tranier added successfully" });
  })
};
