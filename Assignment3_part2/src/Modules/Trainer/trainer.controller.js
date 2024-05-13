import sql_connection from '../../../DB/Models/connection.js';

export const getTrainers = (req, res) => {
    const selectQuery = 'SELECT * FROM trainer';
    sql_connection.execute(selectQuery, (err, result) => {
        if (err) {
            return res.json({ error: err.message });
        }
        return res.json({ data: result });
    });
};
