const { DataTypes } = require('sequelize');
const db = require('../database');

const Feedback = db.define('feedback', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    lastname: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 3,
        },
    },
    more_info: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    difficulties: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true,
    },
    rating_satisfied: {
        type: DataTypes.TINYINT,
        allowNull: true,
        validate: {
            min: 1,
            max: 10,
        },
    },
    recommend: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: true,
    },
    text_box: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},{
    freezeTableName: true,
});

Feedback.sync({ force: false }).then(() => {
    console.log('Feedback table synced');
}).catch(err => {
    console.error('Error syncing Feedback table:', err);
});

module.exports = Feedback;