const { DataTypes } = require('sequelize');
const db = require('../database');
const News = require('./NewsModel');
const Tag = require('./NewsTag');

const ArticleTag = db.define('ArticleTag', {
    news_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: News,
            key: 'news_id',
        },
        onDelete: 'CASCADE',
    },
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Tag,
            key: 'tag_id',
        },
        onDelete: 'CASCADE',
    }
}, {
    freezeTableName: true,
});

ArticleTag.sync({ force: false }).then(() => {
    console.log('ArticleTag table synced');
}).catch(err => {
    console.error('Error syncing ArticleTag table:', err);
});

module.exports = ArticleTag;