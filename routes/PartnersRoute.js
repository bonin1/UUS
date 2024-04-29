const express = require('express');
const router = express.Router();
const Partner = require('../model/Partners');
const { check, validationResult } = require('express-validator');

router.get('/', [
    check('countries').optional().isString(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const countries = req.query.countries ? req.sanitize(req.query.countries) : null;
        const whereCondition = countries ? { countries } : {};

        const partners = await Partner.findAll({
            where: whereCondition,
        });

        res.render('partners', { data: partners });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
