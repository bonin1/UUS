const db = require('../database');
const { DataTypes } = require('sequelize');

const StudyLevel = db.define('study_level', {
    study_level_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    study_level: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    freezeTableName: true,
});


StudyLevel.sync({ force: false }).then(() => {
    console.log('StudyLevel table synced');
}).catch(err => {
    console.error('Error syncing StudyLevel table:', err);
});

module.exports = StudyLevel;