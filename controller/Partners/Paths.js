const { validationResult } = require('express-validator');
const Partner = require('../../model/PartnersModel');
const Department = require('../../model/DepartmentModel');
const { Sequelize } = require('sequelize');

exports.PartnersPath = async (req, res) => {
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

        const uniqueCountries = await Partner.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('countries')), 'countries']],
            order: [['countries', 'ASC']]
        });

        const uniqueLevels = await Partner.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('level')), 'level']],
            order: [['level', 'ASC']]
        });

        const uniqueSemesters = await Partner.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('semester')), 'semester']],
            order: [['semester', 'ASC']]
        });

        const departments = await Department.findAll({
            attributes: ['dep_id', 'dep_name'],
            order: [['dep_name', 'ASC']]
        });

        res.render('partners', {
            data: partners,
            filterOptions: {
                countries: uniqueCountries.map(c => c.countries),
                levels: uniqueLevels.map(l => l.level),
                semesters: uniqueSemesters.map(s => s.semester),
                departments
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};
