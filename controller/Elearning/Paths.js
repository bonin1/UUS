const jwt = require('jsonwebtoken');
const User = require('../../model/UsersModel');
const Department = require('../../model/DepartmentModel');
const TasksModel = require('../../model/TaskModel');


exports.ElearningPath = async (req, res) => {
    const userId = req.session.userId;
    try {
        const userData = await User.findByPk(userId, {
            include: [{ model: Department }],
        });

        if (!userData) {
            return res.status(404).send('User not found');
        }

        res.render('e-learning', { userData });
    } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while fetching user data');
    }
};


exports.GetTasks = async (req, res) => {
    try {
        const tasks = await TasksModel.findAll();
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Unable to fetch tasks at the moment.' });
    }
};


exports.GetCalendar = async (req,res)=>{
    try {
        const tasks = await TasksModel.findAll();
        res.render('Calendar',{ tasks })
    } catch (error) {
        console.log(error)
        res.redirect('/calendar')
    }
};