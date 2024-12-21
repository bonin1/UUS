const { DataTypes } = require('sequelize');
const db = require('../database');
const User = require('./UsersModel');

const AuditLog = db.define('AuditLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    action: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    performed_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIP: true,
        },
    },
    user_agent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
    },
    status: {
        type: DataTypes.ENUM('SUCCESS', 'FAILURE', 'PENDING'),
        defaultValue: 'SUCCESS',
    },
    error_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            name: 'audit_logs_user_id_idx',
            fields: ['user_id']
        },
        {
            name: 'audit_logs_performed_by_idx',
            fields: ['performed_by']
        },
        {
            name: 'audit_logs_action_idx',
            fields: ['action']
        },
        {
            name: 'audit_logs_created_at_idx',
            fields: ['created_at']
        }
    ]
});

AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
AuditLog.belongsTo(User, { foreignKey: 'performed_by', as: 'performer' });

AuditLog.sync({ force: false }).then(() => {
    console.log('AuditLog table synced');
}).catch(err => {
    console.error('Error syncing AuditLog table:', err);
});

module.exports = AuditLog;