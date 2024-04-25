const { DataTypes } = require('sequelize');
const db = require('../database');


const Users = require('./UsersModel')
const Department = require('./DepartmentModel')
const Login  = require('./LoginModel')

const ApplyErasmus = db.define('apply_erasmus', {
    application_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: Users,
            key:"id",
        },
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    place:{
        type: DataTypes.STRING(255),
        allowNull:false,
    },
    semester:{
        type: DataTypes.ENUM('summer','winter'),
        allowNull: false,
    },
    dep_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Department, 
            key: "dep_id",
        },
    },
},{
    freezeTableName: true,
}
);
ApplyErasmus.belongsTo(Users, { foreignKey: 'user_id' });
ApplyErasmus.belongsTo(Department, { foreignKey: 'dep_id' });

ApplyErasmus.sync({ force: false }).then(() => {
    console.log('ApplyErasmus table synced');
}).catch(err => {
    console.error('Error syncing ApplyErasmus table:', err);
});

module.exports = ApplyErasmus;
