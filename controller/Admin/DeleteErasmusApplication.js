const ApplyErasmus = require('../../model/ApplyModel');

exports.DeleteErasmusApplication = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Invalid ID parameter.' });
        }

        const deletedApply = await ApplyErasmus.destroy({ where: { application_id: id} });

        if (!deletedApply) {
            return res.status(404).json({ error: 'ApplyErasmus record not found.' });
        }

        res.redirect('/admin/protected');
    } catch (err) {
        console.error('Error deleting ApplyErasmus record:', err);
        res.status(500).json({ error: 'An error occurred while deleting the record.' });
    }
};