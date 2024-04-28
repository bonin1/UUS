const { DataTypes } = require('sequelize');
const db = require('../database');
const Department = require('./DepartmentModel')


const Partners = db.define('Partners', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Countries: {
        type: DataTypes.STRING(255)
    },
    Open_scolars: {
        type: DataTypes.INTEGER
    },
    Partners_photos: {
        type: DataTypes.BLOB
    },
    Level: {
        type: DataTypes.ENUM('Bachelor', 'Master')
    },
    Semester: {
        type: DataTypes.ENUM('Winter', 'Summer')
    },
    Dep_id: {
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
