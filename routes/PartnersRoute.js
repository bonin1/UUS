const express = require('express');
const router = express.Router();
const Partner = require('../model/Partners');
const { check, validationResult } = require('express-validator');

router.get('/', [
    check('countries').optional().isString(),
    check('level').optional().isString(),
    check('semester').optional().isString(),
    check('dep_id').optional().isInt(), 
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const countries = req.query.countries ? req.sanitize(req.query.countries) : null;
        const level = req.query.level ? req.sanitize(req.query.level) : null;
        const semester = req.query.semester ? req.sanitize(req.query.semester) : null;
        const dep_id = req.query.dep_id ? parseInt(req.sanitize(req.query.dep_id)) : null;

        const whereCondition = {};
        if (countries) {
            whereCondition.countries = countries;
        }
        if (level) {
            whereCondition.level = level;
        }
        if (semester) {
            whereCondition.semester = semester;
        }
        if (dep_id) {
            whereCondition.dep_id = dep_id;
        }

        const partners = await Partner.findAll({
            where: whereCondition,
        });

        for (const partner of partners) {
            if (partner.partners_photos !== null) {
                const blobData = partner.partners_photos;
                const base64Data = blobData.toString('base64');
                partner.partners_photos = base64Data;
            }
        }
        
        res.render('partners', { data: partners });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
