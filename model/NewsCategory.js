const { DataTypes } = require('sequelize');
const db = require('../database');

const NewsCategory = db.define('NewsCategory', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});

NewsCategory.sync({ force: false }).then( async () => {
    console.log('NewsCategory table synced');

    const defaultCategories = ['ComputerScience', 'General', 'CyberSecurity'];
    for (const catName of defaultCategories) {
        const exists = await NewsCategory.findOne({ where: { category_name: catName }});
        if (!exists) {
            await NewsCategory.create({ category_name: catName });
            console.log(`Created default categories: ${catName}`);
        }
    }

}).catch(err => {
    console.error('Error syncing NewsCategory table:', err);
});

module.exports = NewsCategory;