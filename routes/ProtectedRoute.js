const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const apply = require('../model/ApplyModel')
const User = require('../model/UsersModel');
const department = require('../model/DepartmentModel')
const Feedback = require('../model/FeedbackModel');
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
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            const studentCount = await User.count({ where: { role: 'student' } });
            const professorCount = await User.count({ where: { role: 'professor' } });
            const departments = await department.findAll({ attributes: ['dep_id', 'dep_name'] });
            const departmentCount = departments.length;

            const departmentStudentCounts = await Promise.all(departments.map(async (dep) => {
                const count = await User.count({ where: { role: 'student', dep_id: dep.dep_id } });
                return { dep_name: dep.dep_name, count };
            }));
            const feedbackData = await Feedback.findAll({
                attributes: [
                    'name', 
                    'lastname', 
                    'text_box',
                    'rating',
                    'rating_satisfied',
                    'more_info',
                ],
            });
            const totalRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
            const averageRating = totalRatings / feedbackData.length;

            const totalSatisfiedRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating_satisfied, 0);
            const averageSatisfiedRating = totalSatisfiedRatings / feedbackData.length;

            const moreInfoCounts = {};
            feedbackData.forEach(feedback => {
                if (feedback.more_info in moreInfoCounts) {
                    moreInfoCounts[feedback.more_info]++;
                } else {
                    moreInfoCounts[feedback.more_info] = 1;
                }
            });

            apply.findAll()
                .then(results => {
                    res.render('protected', {
                        row: feedbackData, 
                        data: results, 
                        studentCount, 
                        professorCount, 
                        departmentCount, 
                        departmentStudentCounts, 
                        averageRating ,
                        averageSatisfiedRating,
                        moreInfoCounts
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('An error occurred.');
                });
        } catch (err) {
            console.error('Error fetching student count:', err);
            res.status(500).send('Error fetching student count');
        }
    } else {
        res.redirect('/admin');
    }
});





module.exports = router