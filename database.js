const Sequelize = require('sequelize');
require('dotenv').config()


const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false

});


db.authenticate()
    .then(() => console.log("connection has been established"))
    .catch(err => console.error("unable to connect to the database:", err));


    module.exports = db