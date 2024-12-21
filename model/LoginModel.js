const { DataTypes } = require('sequelize');
const db = require('../database');
const Users = require('./UsersModel')

const LoginInformation = db.define('login_information', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: Users,
            key:"id",
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordResetToken: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'login_information',
    underscored: true
});
LoginInformation.belongsTo(Users, { foreignKey: 'user_id' });

LoginInformation.sync({ force: false }).then(() => {
    console.log('LoginInformation table synced');
}).catch(err => {
    console.error('Error syncing LoginInformation table:', err);
});


module.exports = LoginInformation;