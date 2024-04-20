
const { DataTypes } = require('sequelize');
const db = require('../database');

const ApplyForm = db.define('apply_form', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    high_school: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    study_level: {
        type: DataTypes.ENUM('bachelor', 'master'),
        allowNull: false,
    },
    choose_dep: {
        type: DataTypes.ENUM('computer_science', 'cyber', 'law'),
        allowNull: false,
    },
    application_date: {
        type: DataTypes.DATE,
        allowNull: false,   
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
    }
},{
    freezeTableName: true,
}
);

ApplyForm.sync({ force: false }).then(() => {
    console.log('ApplyForm table synced');
}).catch(err => {
    console.error('Error syncing ApplyForm table:', err);
});

module.exports = ApplyForm;
