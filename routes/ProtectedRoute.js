const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const apply = require('../model/ApplyModel')

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

router.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        apply.findAll()
            .then(results => {
                res.render('protected', { data: results });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred.');
            });
    } else {
        res.redirect('/admin');
    }
});




module.exports = router