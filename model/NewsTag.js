const { DataTypes } = require('sequelize');
const db = require('../database');

const NewsTag = db.define('NewsTag', {
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tag: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {
    freezeTableName: true,
});

NewsTag.sync({ force: false }).then(() => {
    console.log('NewsTag table synced');
}).catch(err => {
    console.error('Error syncing NewsTag table:', err);
});

module.exports = NewsTag;