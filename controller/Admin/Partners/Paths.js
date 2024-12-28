const PartnersModel = require('../../../model/Partners');
const Department = require('../../../model/DepartmentModel');
const StudyLevel = require('../../../model/StudyLevel');
const { StatusCodes } = require('http-status-codes');

exports.PartnerPath = async (req, res, next) => {
    const { id: userId } = req.params;

    if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Partner ID is required'
        });
    }

    try {
        const [partner, departments, studyLevels] = await Promise.all([
            PartnersModel.findOne({ where: { id: userId } }),
            Department.findAll(),
            StudyLevel.findAll()
        ]);

        if (!partner) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Partner not found'
            });
        }

        return res.render('editpartners', {
            data: partner,
            successAlert: req.flash('success'),
            dangerAlert: req.flash('danger'),
            departments,
            studyLevels
        });
    } catch (error) {
        next(error);
    }
};