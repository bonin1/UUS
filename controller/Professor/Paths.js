const User = require('../../model/UsersModel');
const Course = require('../../model/CoursesModel');
const { getUserFromToken } = require('../../middleware/GetUserFromToken');

exports.ProfessorPath = async (req, res) => {
    try {
        const user = await getUserFromToken(req);
        const professorId = user.id;

        const [coursesData, userData] = await Promise.all([
            Course.findAll({
                where: { professor_id: professorId },
                raw: true
            }),
            User.findByPk(professorId, {
                raw: true
            })
        ]);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Professor profile not found'
            });
        }

        return res.render('professor', {
            courses: coursesData,
            user: userData
        });

    } catch (error) {
        console.error('Professor path error:', error);
        return res.status(401).json({
            success: false,
            message: error.message || 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};