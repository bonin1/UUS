const User = require('../../model/UsersModel');
const Enrollment = require('../../model/EnrollmentModel');
const Course = require('../../model/CoursesModel');
const Grade = require('../../model/GradesModel');
const Department = require('../../model/DepartmentModel');

exports.ProfessorPath = async (req, res) => {
    const userId = req.session.rememberToken || req.session.userId || req.session.sessionToken;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    try {
        const coursesData = await Course.findAll({
            where: { professor_id: userId },
            include: [{
                model: Enrollment,
                include: [{
                    model: Grade
                }]
            }]
        });

        if (!coursesData || coursesData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found for this professor'
            });
        }

        const userData = await User.findByPk(userId, {
            include: [{ model: Department }]
        });

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'Professor profile not found'
            });
        }

        const processedData = {
            professor: userData,
            courses: coursesData.map(course => ({
                ...course.toJSON(),
                enrollmentCount: course.Enrollments?.length || 0
            }))
        };

        return res.render('professor', processedData);

    } catch (error) {
        console.error('Professor path error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};