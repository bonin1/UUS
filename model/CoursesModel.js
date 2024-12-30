const { DataTypes } = require('sequelize');
const db = require('../database');

const Course = db.define('Course', {
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    dep_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: 'Department', 
            key: 'dep_id',
        },
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schedule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    classroom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});

Course.sync({ force: false }).then(() => {
    console.log('Course table synced');
}).catch(err => {
    console.error('Error syncing Course table:', err);
});

module.exports = Course;
