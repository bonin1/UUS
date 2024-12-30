const { DataTypes } = require('sequelize');
const db = require('../database');
const Course = require('./CoursesModel');
const User = require('./UsersModel');

const Grade = db.define('Grade', {
    grade_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'course_id',
        },
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 10
        }
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected'),
        allowNull: false,
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true,
});


Grade.sync({ force: false }).then(() => {
    console.log('Grade table synced');
}).catch(err => {
    console.error('Error syncing Grade table:', err);
});

module.exports = Grade;
