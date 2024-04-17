const express = require('express');
const db = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('apply');
});

router.post('/', (req, res) => {
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
        status
    } = req.body;

    const formData = {
        name,
        lastname,
        phone_number,
        email,
        address,
        high_school,
        study_level,
        choose_dep,
        application_date,
        status: status || 'pending'
    };

    const sql = 'INSERT INTO apply_form SET ?';
    db.query(sql, formData, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error inserting data into database' });
        } else {
            const script = `<script>alert('Application submitted successfully!');</script>`;
            res.send(script);
        }
    });
});

module.exports = router;
