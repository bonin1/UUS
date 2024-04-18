const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Feedback = require('../model/FeedbackModel');
const flash = require('connect-flash');
const loggingRateLimiter = require('../middleware/loginlimitter');
const sessionMiddleware = require('../middleware/sesionMiddleware');

router.use(flash());
router.use(loggingRateLimiter);
router.use(sessionMiddleware);

router.get('/', (req, res) => {
    res.render('feedback', { successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
});

router.post('/', [
    body('name').optional(),
    body('lastname').optional(),
    body('rating').isIn(['1', '2', '3']).optional(),
    body('more_info.*').optional(),
    body('difficulties').optional().isIn(['yes', 'no']),
    body('rating_satisfied').isInt({ min: 1, max: 10 }).optional(),
    body('recommend').optional().isIn(['yes', 'no']),
    body('text_box').optional(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('danger', `Something went wrong try again!`);
        return res.redirect('/feedback');
    }

    const { name, lastname, rating, more_info, difficulties, rating_satisfied, recommend, text_box } = req.body;

    try {
        await Feedback.create({
            name,
            lastname,
            rating,
            more_info,
            difficulties,
            rating_satisfied,
            recommend,
            text_box
        });
        req.flash('success', 'Feedback is successful!');
        res.redirect('/feedback');
    } catch (err) {
        req.flash('danger', 'Feedback is not successful, try again later!');
        res.redirect('/feedback');
        console.log(err)
    }
});

module.exports = router;
