const { DataTypes, Model } = require('sequelize');
const db = require('../database');

const Task = db.define('tasks', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    task_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    scheduled_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'tasks',
    underscored: true
});

Task.sync({ force: false }).then(() => {
    console.log('Tasks table synced');
}).catch(err => {
    console.error('Error syncing tasks table:', err);
});

module.exports = Task;
