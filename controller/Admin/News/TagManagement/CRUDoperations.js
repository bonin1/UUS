const NewsTag = require('../../../../model/NewsTag');


exports.CreateNewsTag = async (req, res) => {
    try {
        const { tag_name } = req.body;
        const tag = await NewsTag.create({ tag_name });

        req.flash('success', 'Tag created successfully');
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error in CreateNewsTag:', error);
        req.flash('danger', 'Error creating tag');
        res.redirect('/admin/protected');
    }
}

exports.UpdateNewsTag = async (req, res) => {
    try {
        const { tag_id, tag_name } = req.body;
        const tag = await NewsTag.findByPk(tag_id);
        if (!tag) {
            req.flash('danger', 'Tag not found');
            return res.redirect('/admin/protected');
        }

        tag.tag_name = tag_name;
        await tag.save();

        req.flash('success', 'Tag updated successfully');
        res.redirect('/admin/protected/news');
    } catch (error) {
        console.error('Error in UpdateNewsTag:', error);
        req.flash('danger', 'Error updating tag');
        res.redirect('/admin/protected');
    }
}

exports.DeleteNewsTag = async (req, res) => {
    try {
        const { tag_id } = req.body;
        const tag = await NewsTag.findByPk(tag_id);
        if (!tag) {
            req.flash('danger', 'Tag not found');
            return res.redirect('/admin/protected');
        }

        await tag.destroy();

        req.flash('success', 'Tag deleted successfully');
        res.redirect('/admin/protected/news');
    } catch (error) {
        console.error('Error in DeleteNewsTag:', error);
        req.flash('danger', 'Error deleting tag');
        res.redirect('/admin/protected/news');
    }
}
