const express = require('express');
const flash = require('connect-flash');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ApplyErasmus = require('../model/applyErasmusModel')
router.use(express.urlencoded({ extended: true }));
const loggingRateLimiter = require('../middleware/loginlimitter')
const sessionMiddleware = require('../middleware/sesionMiddleware')
const User = require('../model/UsersModel');


router.use(flash());
router.use(loggingRateLimiter)
router.use(sessionMiddleware);

router.get('/', (req, res) => {
    res.render('applyerasmus', { successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
});

router.post('/', 
[
    body('fullname').isLength({ min: 1 }),
    body('place').isLength({ min: 1 }),
    body('semester').isLength({ min: 1 }),
    body('dep_id').isInt()
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('danger', errors.array().map(error => error.msg).join(' '));
        return res.redirect('/apply-erasmus');
    }

    if (!req.session.userId) {
        req.flash('danger', 'You must be logged in to submit an application.');
        return res.redirect('/apply-erasmus');
    }

    const { fullname, place, semester, dep_id } = req.body;
    const userId = req.session.userId; 
    console.log('User ID:', userId);
    const user = await User.findByPk(userId);
    if (!user) {
        req.flash('danger', 'Invalid user. Please log in again.');
        return res.redirect('/apply-erasmus');
    }

    try {
        await ApplyErasmus.create({ fullname, place, semester, dep_id, user_id: userId });
        req.flash('success', 'Application submitted successfully!');
        return res.redirect('/apply-erasmus');
    } catch (err) {
        console.error('Error creating ApplyErasmus instance:', err);
        req.flash('danger', 'Failed to submit application. Please try again later.');
        return res.redirect('/apply-erasmus');
    }
});

module.exports = router;