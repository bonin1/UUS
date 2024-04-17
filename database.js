const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'uusdb'
});

db.getConnection((err, connection) => {
    if(err) {
        console.error('Error connecting to the database: ', err);
    } else {
        console.log('Successfully connected to the database');
        connection.release();
    }
});

module.exports = db;