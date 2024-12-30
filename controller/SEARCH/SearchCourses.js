const CoursesModel = require('../../model/CoursesModel');
const { Op } = require('sequelize');

exports.SearchCourses = async (req, res) => {
    try {
        const query = req.body.query;

        if (query === '') {
            res.send([]);
            return;
        }
        const results = await CoursesModel.findAll({
            where: {
                course_name: {
                    [Op.like]: `%${query}%`
                }
            }
        });

        res.send(results);
    } catch (err) {
        console.error(err);
        res.send([]);
    }
};