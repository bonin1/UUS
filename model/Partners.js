const { DataTypes } = require('sequelize');
const db = require('../database');
const Department = require('./DepartmentModel');

const Partners = db.define('Partners', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255)
    },
    countries: {
        type: DataTypes.STRING(255)
    },
    open_scolars: {
        type: DataTypes.INTEGER
    },
    partners_photos: {
        type: DataTypes.BLOB('long')
    },
    level: {
        type: DataTypes.ENUM('Bachelor', 'Master')
    },
    semester: {
        type: DataTypes.ENUM('Winter', 'Summer')
    },
    dep_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Department,
            key: 'dep_id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'Partners',
    underscored: true
});

Partners.belongsTo(Department, { foreignKey: 'dep_id' });

Partners.sync({ force: false }).then(() => {
    console.log('Partners table synced');
}).catch(err => {
    console.error('Error syncing Partners table:', err);
});

module.exports = Partners;
