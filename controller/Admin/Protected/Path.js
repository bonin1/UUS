
const Apply = require('../../../model/ApplyModel');
const User = require('../../../model/UsersModel');
const Department = require('../../../model/DepartmentModel');
const Feedback = require('../../../model/FeedbackModel');
const ApplyErasmus = require('../../../model/applyErasmusModel'); 
const TasksModel = require('../../../model/TaskModel')
const Studylevel = require('../../../model/StudyLevelModel');
const Courses = require('../../../model/CoursesModel');
const NewsTag = require('../../../model/NewsTag');
const NewsCategory = require('../../../model/NewsCategory');
const jwt = require('jsonwebtoken');


exports.ProtectedPath = async (req, res) => {
    const alert = req.session.alert;
    req.session.alert = null;
    try {

        const token = req.cookies.authToken;
        let userRole = null;
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userRole = decoded.role;
        }


        const [studentCount, professorCount, departments, feedbackData, applies, applyErasmus, courses] = await Promise.all([
            User.count({ where: { role: 'student' } }),
            User.count({ where: { role: 'professor' } }),
            Department.findAll({ attributes: ['dep_id', 'dep_name'] }),
            Feedback.findAll({
                attributes: [
                    'name',
                    'lastname',
                    'text_box',
                    'rating',
                    'rating_satisfied',
                    'more_info',
                    'difficulties',
                    'recommend'
                ],
            }),
            Apply.findAll(),
            ApplyErasmus.findAll({
                include: [
                    { model: Department, attributes: ['dep_name'] },
                    { model: User, attributes: ['email'] }
                ]
            }),
            Courses.findAll()
        ]);

        const departmentCount = departments.length;

        const department = await Department.findAll();

        const availableRoles = User.rawAttributes.role.values;

        const departmentStudentCounts = await Promise.all(departments.map(async (dep) => {
            const count = await User.count({ where: { role: 'student', dep_id: dep.dep_id } });
            return { dep_name: dep.dep_name, count };
        }));

        const totalRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
        const averageRating = totalRatings / feedbackData.length;

        const totalSatisfiedRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating_satisfied, 0);
        const averageSatisfiedRating = totalSatisfiedRatings / feedbackData.length;

        const moreInfoCounts = {};
        const difficulties = {};
        const recommend = {};

        feedbackData.forEach(feedback => {
            moreInfoCounts[feedback.more_info] = (moreInfoCounts[feedback.more_info] || 0) + 1;
            difficulties[feedback.difficulties] = (difficulties[feedback.difficulties] || 0) + 1;
            recommend[feedback.recommend] = (recommend[feedback.recommend] || 0) + 1;
        });

        const tasks = await TasksModel.findAll();
        
        const StudyLevels = await Studylevel.findAll();

        const totalStudyLevels = await Studylevel.count();

        const NewsTags = await NewsTag.findAll();

        const NewsCategorys = await NewsCategory.findAll();

        res.render('protected', {
            row: feedbackData,
            data: applies,
            card: applyErasmus,
            studentCount,
            professorCount,
            departmentCount,
            departmentStudentCounts,
            averageRating,
            averageSatisfiedRating,
            moreInfoCounts,
            difficulties,
            recommend,
            alert: alert ,
            tasks,
            department,
            successAlert: req.flash('success'), dangerAlert: req.flash('danger'),
            StudyLevels,
            totalStudyLevels,
            userRole,
            availableRoles,
            courses,
            NewsTags,
            NewsCategorys
        });

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('An error occurred.');
    }
};