const { DataTypes } = require('sequelize');
const db = require('../database');
const User = require('./UsersModel');

const News = db.define('News', {
    news_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    publish_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    published_by_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
}, {
    freezeTableName: true,
});


News.sync({ force: false }).then(() => {
    console.log('News table synced');
}).catch(err => {
    console.error('Error syncing News table:', err);
});

module.exports = News;
