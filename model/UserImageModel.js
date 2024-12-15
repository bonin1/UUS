const { DataTypes, Model } = require('sequelize');
const db = require('../database');
const Users = require('./UsersModel')


const UserImage = db.define('userimage', {
    id:{
        type:DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model: Users,
            key:"id",
        },
        onDelete: 'CASCADE'
    },
    photo_user:{
        type: DataTypes.BLOB('long') ,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'userimage',
    underscored: true
});

UserImage.belongsTo(Users, { foreignKey: 'user_id' });

UserImage.sync({ force: false }).then(() => {
    console.log('UserImage table synced');
}).catch(err => {
    console.error('Error syncing UserImage table:', err);
});


module.exports = UserImage