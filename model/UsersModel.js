const { DataTypes } = require('sequelize');
const db = require('../database');
const Department = require('./DepartmentModel');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dep_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Department,
            key: 'dep_id',
        },
    },
    role: {
        type: DataTypes.ENUM('student', 'admin', 'professor'),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    freezeTableName: true,
});

User.belongsTo(Department, { foreignKey: 'dep_id' });
User.sync({ force: false }).then(() => {
    console.log('User table synced');
}).catch(err => {
    console.error('Error syncing User table:', err);
});
module.exports = User;
