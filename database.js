const Sequelize = require('sequelize');
require('dotenv').config()

const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false
});

db.authenticate()
    .then(() => {
        console.log("connection has been established");
        db.query(`CREATE DATABASE IF NOT EXISTS uusdb;`)
            .then(() => console.log('Database created or successfully checked'))
            .catch(err => console.error('Error in creating database', err));
    })
    .catch(err => console.error("unable to connect to the database:", err));

module.exports = db;
