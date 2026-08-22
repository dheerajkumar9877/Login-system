const sql =require('mysql2');
require('dotenv').config();

const db = sql.createPool({
    host: process.env.DB_HOST ,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database : process.env.DB_NAME
});

db.getConnection(db,(err,connection) =>{
    if(err){
        console.log("MY sql connection failed : ",err);
        return;
    }
    console.log("Connected...");
    connection.release() ;
})

module.exports = db ;