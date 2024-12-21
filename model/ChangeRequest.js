const { DataTypes } = require('sequelize');
const db = require('../database');
const User = require('./UsersModel');

const ChangeRequest = db.define('ChangeRequest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    requested_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    change_type: {
        type: DataTypes.ENUM('CREATE_LOGIN', 'UPDATE_LOGIN', 'DELETE_LOGIN'),
        allowNull: false,
    },
    new_data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        defaultValue: 'PENDING',
    },
    approved_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    approved_at: {
        type: DataTypes.DATE,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    freezeTableName: true,
});

ChangeRequest.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

ChangeRequest.belongsTo(User, {
    foreignKey: 'requested_by',
    as: 'requestedBy'
});

ChangeRequest.belongsTo(User, {
    foreignKey: 'approved_by',
    as: 'approvedBy'
});

User.hasMany(ChangeRequest, {
    foreignKey: 'user_id',
    as: 'changesReceived'
});

User.hasMany(ChangeRequest, {
    foreignKey: 'requested_by',
    as: 'changesRequested'
});

User.hasMany(ChangeRequest, {
    foreignKey: 'approved_by',
    as: 'changesApproved'
});

ChangeRequest.sync({ force: false }).then(() => {
    console.log('ChangeRequest table synced');
}).catch(err => {
    console.error('Error syncing ChangeRequest table:', err);
});

module.exports = ChangeRequest;