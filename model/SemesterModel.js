const { DataTypes } = require('sequelize');
const db = require('../database');

const Semester = db.define('Semester', {
    sem_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sem_name: {
        type: DataTypes.ENUM('Fall', 'Spring', 'Summer'),
        allowNull: false,
    }
},{
    freezeTableName: true,
    timestamps: false,
});


Semester.sync({ force: false }).then(async () => {
    console.log('Semester table synced');
    
    const defaultSemesters = ['Fall', 'Spring', 'Summer'];
    for (const semName of defaultSemesters) {
        const exists = await Semester.findOne({ where: { sem_name: semName }});
        if (!exists) {
            await Semester.create({ sem_name: semName });
            console.log(`Created default semester: ${semName}`);
        }
    }
}).catch(err => {
    console.error('Error syncing Semester table:', err);
});

module.exports = Semester;