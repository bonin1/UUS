const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');

const TasksModel = require('../model/TaskModel')

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    }
}));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    try {
        const tasks = await TasksModel.findAll();
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'An error occurred while fetching tasks' });
    }
});



router.post('/',async(req,res)=>{
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const { taskName, scheduledTime, duration } = req.body;
    const endTime = new Date(new Date(scheduledTime).getTime() + (duration * 24 * 60 * 60 * 1000));

    try {
        const newTask = await TasksModel.create({
            task_name: taskName,
            scheduled_time: scheduledTime,
            end_time: endTime
        });
        res.redirect('/protected')
    } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ error: 'An error occurred while adding the task' });
    }
})


module.exports = router;