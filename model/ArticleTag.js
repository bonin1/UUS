const { DataTypes } = require('sequelize');
const db = require('../database');
const News = require('./NewsModel');
const Tag = require('./NewsTag');

const NewsTag = db.define('NewsTag', {
    articleID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: News,
            key: 'articleID',
        },
        onDelete: 'CASCADE',
    },
    tagID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Tag,
            key: 'tagID',
        },
        onDelete: 'CASCADE',
    }
}, {
    freezeTableName: true,
});

NewsTag.sync({ force: false }).then(() => {
    console.log('NewsTag table synced');
}).catch(err => {
    console.error('Error syncing NewsTag table:', err);
});

module.exports = NewsTag;