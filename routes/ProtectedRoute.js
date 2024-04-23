const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const apply = require('../model/ApplyModel')
const User = require('../model/UsersModel');
const department = require('../model/DepartmentModel')

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
            const departments = await department.findAll();
            const departmentCount = departments.length;
            apply.findAll()
                .then(results => {
                    res.render('protected', { data: results, studentCount,professorCount,departmentCount });
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