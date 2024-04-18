const express = require('express');
const ApplyForm = require('../model/ApplyModel');
const flash = require('connect-flash');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const loggingRateLimiter = require('../middleware/loginlimitter')
const sessionMiddleware = require('../middleware/sesionMiddleware')


router.use(flash());
router.use(loggingRateLimiter)
router.use(sessionMiddleware);

router.get('/', (req, res) => {
    res.render('apply', { successAlert: req.flash('success'), dangerAlert: req.flash('danger') });
});


router.post('/', 
[
    body('email').isEmail(),
    body('phone_number').isMobilePhone(),
    body('name').isLength({ min: 1 }),
    body('lastname').isLength({ min: 1 }),
    body('address').isLength({ min: 1 }),
    body('high_school').isLength({ min: 1 }),
    body('study_level').isLength({ min: 1 }),
    body('choose_dep').isLength({ min: 1 })
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('danger', `Something went wrong try again!`);
        return res.redirect('/apply');
    }
    const {
        user_id,
        name,
        lastname,
        phone_number,
        email,
        address,
        high_school,
        study_level,
        choose_dep,
        application_date,
        status = 'pending'
    } = req.body;

    try {
        await ApplyForm.create({
            user_id,
            name,
            lastname,
            phone_number,
            email,
            address,
            high_school,
            study_level,
            choose_dep,
            application_date,
            status
        });
        req.flash('success', 'Application is successful!');
        res.redirect('/apply');
    } catch (err) {
        req.flash('danger', 'Application is not successful, try again later!');
        res.redirect('/apply');
    }
});

module.exports = router;