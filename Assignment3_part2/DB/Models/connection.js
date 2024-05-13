import mysql2 from 'mysql2' ;

const sql_connection = mysql2.createConnection({
    host:'localhost',
    database:'gym',
    user:'root',
    password:''
})
export default sql_connection ; 
