const { DataTypes } = require('sequelize');
const db = require('../database');

const Enrollment = db.define('Enrollment', {
    enrollment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Course',
            key: 'course_id',
        },
    },
    enrollment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('active', 'dropped', 'completed'),
        defaultValue: 'active',
    }
}, {
    freezeTableName: true,
});


Enrollment.sync({ force: false }).then(() => {
    console.log('Enrollment table synced');
}).catch(err => {
    console.error('Error syncing Enrollment table:', err);
});

module.exports = Enrollment;
