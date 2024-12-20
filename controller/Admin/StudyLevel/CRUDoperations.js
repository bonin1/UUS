const StudyLevel = require('../../../model/StudyLevel');

exports.CreateStudyLevel = async (req, res) => {
    const { study_level } = req.body;
    try {
        const studyLevel = await StudyLevel.create({
            study_level
        });
        req.flash('success', 'Study level created successfully');
        res.redirect('/admin/protected');
    } catch (err) {
        req.flash('error', 'Error creating study level');
        res.status(500).json({ error: err });
    }
}

exports.UpdateStudyLevel = async (req, res) => {
    const { study_level_id } = req.params;
    const { study_level } = req.body;
    try {
        const studyLevel = await StudyLevel.findByPk(study_level_id);
        if (!studyLevel) {
            return res.status(404).json({ message: 'Study level not found' });
        }
        studyLevel.study_level = study_level;
        await studyLevel.save();

        req.flash('success', 'Study level updated successfully');
        res.redirect('/admin/protected');
    } catch (err) {
        req.flash('error', 'Error updating study level');
        res.status(500).json({ error: err });
    }
}


exports.DeleteStudyLevel = async (req, res) => {
    const { study_level_id } = req.params;
    try {
        const studyLevel = await StudyLevel.findByPk(study_level_id);
        if (!studyLevel) {
            return res.status(404).json({ message: 'Study level not found' });
        }
        await studyLevel.destroy();
        req.flash('success', 'Study level deleted successfully');
        res.redirect('/admin/protected');
    } catch (err) {
        req.flash('error', 'Error deleting study level');
        res.status(500).json({ error: err });
    }
}

