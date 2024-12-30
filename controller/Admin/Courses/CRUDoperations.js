const CoursesModel = require('../../../model/CoursesModel');

exports.CreateCourse = async (req, res) => {
    try {
        const { course_name, course_code, dep_id, professor_id, semester, credits, description, schedule, classroom, available } = req.body;
        
        const semesterId = semester ? parseInt(semester) : null;
        
        const course = await CoursesModel.create({
            course_name,
            course_code,
            dep_id,
            professor_id,
            semester: semesterId,
            credits,
            description,
            schedule,
            classroom,
            available: available === 'true' || available === true
        });

        req.flash('success', 'Course created successfully');
        return res.redirect('/admin/viewAll/courses');

    } catch (error) {
        console.error('Create course error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.UpdateCourse = async (req, res) => {
    try {
        const course_id = req.params.id;
        
        const semesterId = req.body.semester ? parseInt(req.body.semester) : null;
        
        const updateData = {
            course_name: req.body.course_name,
            course_code: req.body.course_code,
            dep_id: req.body.dep_id,
            professor_id: req.body.professor_id,
            semester: semesterId, 
            credits: req.body.credits,
            description: req.body.description,
            schedule: req.body.schedule,
            classroom: req.body.classroom,
            available: req.body.available === 'true' || req.body.available === true
        };

        const [updated] = await CoursesModel.update(updateData, {
            where: { course_id: course_id }
        });

        if (updated) {
            const updatedCourse = await CoursesModel.findByPk(course_id);
            req.flash('success', 'Course updated successfully');
            return res.redirect(`/admin/courses/${course_id}`);
        }

        throw new Error('Course not found');

    } catch (error) {
        console.error('Update course error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.DeleteCourse = async (req, res) => {
    try {
        const course_id = req.params.id;
        
        if (!course_id || isNaN(course_id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID'
            });
        }

        const course = await CoursesModel.findByPk(course_id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        req.flash('success', 'Course deleted successfully');
        await course.destroy();
        
        return res.redirect('/admin/viewAll/courses');

    } catch (error) {
        console.error('Delete course error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete course',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}