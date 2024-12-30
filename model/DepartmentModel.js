const { DataTypes } = require('sequelize');
const db = require('../database');

const Department = db.define('Department', {
    dep_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dep_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}   
,{
    freezeTableName: true,
    timestamps: false,
});

Department.sync({ force: false }).then(() => {
    console.log('Department table synced');
}).catch(err => {
    console.error('Error syncing Department table:', err);
});

module.exports = Department;
