const { DataTypes } = require('sequelize');
const db = require('../database');
const News = require('./NewsModel');

const NewsMedia = db.define('NewsMedia', {
    media_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    primary_image: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
    },
    additional_media: {
        type: DataTypes.BLOB('long'),
        allowNull: false,
    },
    news_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: News,
            key: 'news_id',
        },
        onDelete: 'CASCADE',
    },
    media_type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false,
    },
}, {
    freezeTableName: true,
    instanceMethods: {
        getPrimaryImage() {
            return this.primary_image ? this.primary_image.toString('base64') : null;
        },
        getAdditionalMedia() {
            return this.additional_media ? this.additional_media.toString('base64') : null;
        }
    }
});

NewsMedia.sync({ force: false }).then(() => {
    console.log('NewsMedia table synced');
}).catch(err => {
    console.error('Error syncing NewsMedia table:', err);
});

module.exports = NewsMedia;