const Course = require('../../../model/CoursesModel');
const Department = require('../../../model/DepartmentModel');
const User = require('../../../model/UsersModel');
const Semester = require('../../../model/SemesterModel');

exports.ViewAllCourses = async (req, res) => {
    try {
        const { semester, department, professor } = req.query;
        
        const whereClause = {};
        if (semester) whereClause.semester = semester;
        if (department) whereClause.dep_id = department;
        if (professor) whereClause.professor_id = professor;

        const coursesData = await Course.findAll({
            where: whereClause
        });

        const departmentsData = await Department.findAll();
        const professorsData = await User.findAll({
            where: { role: 'professor' }
        });
        const semestersData = await Semester.findAll();

        return res.render('ViewAllCourses', {
            coursesData,
            departmentsData,
            professorsData,
            semestersData,
            filters: { semester, department, professor },
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });

    } catch (error) {
        req.flash('error', 'Failed to load courses. Please try again.');
        console.error('View all courses error:', error);
        return res.redirect('/admin/dashboard');
    }
};

exports.CoursePathById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const courseData = await Course.findByPk(courseId);
        const departmentsData = await Department.findAll();
        const professorsData = await User.findAll({
            where: { role: 'professor' }
        });
        const semestersData = await Semester.findAll();

        if (!courseData) {
            req.flash('error', 'Course not found');
            return res.redirect('/admin/viewAll/courses');
        }

        return res.render('courseById', {
            courseData,
            departmentsData,
            professorsData,
            semestersData,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });

    } catch (error) {
        req.flash('error', 'Failed to load course details. Please try again.');
        console.error('Course path error:', error);
        return res.redirect('/admin/viewAll/courses');
    }
};
