const { DataTypes } = require('sequelize');
const db = require('../database');
const Course = require('./CoursesModel');

const Department = db.define('Department', {
    dep_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dep_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}
,{
    freezeTableName: true,
    timestamps: false,
});


module.exports = Department;
