const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');



const Apply = require('../model/ApplyModel');
const User = require('../model/UsersModel');
const Department = require('../model/DepartmentModel');
const Feedback = require('../model/FeedbackModel');
const ApplyErasmus = require('../model/applyErasmusModel'); 
const Login = require('../model/LoginModel')
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
    const alert = req.session.alert;
    req.session.alert = null;
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.redirect('/admin');
        }

        const [studentCount, professorCount, departments, feedbackData, applies, applyErasmus] = await Promise.all([
            User.count({ where: { role: 'student' } }),
            User.count({ where: { role: 'professor' } }),
            Department.findAll({ attributes: ['dep_id', 'dep_name'] }),
            Feedback.findAll({
                attributes: [
                    'name',
                    'lastname',
                    'text_box',
                    'rating',
                    'rating_satisfied',
                    'more_info',
                    'difficulties',
                    'recommend'
                ],
            }),
            Apply.findAll(),
            ApplyErasmus.findAll({
                include: [
                    { model: Department, attributes: ['dep_name'] },
                    { model: User, attributes: ['email'] }
                ]
            })
        ]);

        const departmentCount = departments.length;

        const departmentStudentCounts = await Promise.all(departments.map(async (dep) => {
            const count = await User.count({ where: { role: 'student', dep_id: dep.dep_id } });
            return { dep_name: dep.dep_name, count };
        }));

        const totalRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
        const averageRating = totalRatings / feedbackData.length;

        const totalSatisfiedRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating_satisfied, 0);
        const averageSatisfiedRating = totalSatisfiedRatings / feedbackData.length;

        const moreInfoCounts = {};
        const difficulties = {};
        const recommend = {};

        feedbackData.forEach(feedback => {
            moreInfoCounts[feedback.more_info] = (moreInfoCounts[feedback.more_info] || 0) + 1;
            difficulties[feedback.difficulties] = (difficulties[feedback.difficulties] || 0) + 1;
            recommend[feedback.recommend] = (recommend[feedback.recommend] || 0) + 1;
        });

        const tasks = await TasksModel.findAll();
        res.render('protected', {
            row: feedbackData,
            data: applies,
            card: applyErasmus,
            studentCount,
            professorCount,
            departmentCount,
            departmentStudentCounts,
            averageRating,
            averageSatisfiedRating,
            moreInfoCounts,
            difficulties,
            recommend,
            alert: alert ,
            tasks
        });

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('An error occurred.');
    }
});




module.exports = router;
