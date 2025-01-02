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

NewsTag.sync({ force: false }).then(async() => {
    console.log('NewsTag table synced');

    const defaultTags = ['Computer', 'Science',];
    for (const tagName of defaultTags) {
        const exists = await NewsTag.findOne({ where: { tag: tagName }});
        if (!exists) {
            await NewsTag.create({ tag: tagName });
            console.log(`Created default tags: ${tagName}`);
        }
    }
}).catch(err => {
    console.error('Error syncing NewsTag table:', err);
});

module.exports = NewsTag;