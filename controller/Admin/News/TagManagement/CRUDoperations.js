const NewsTag = require('../../../../model/NewsTag');


exports.CreateNewsTag = async (req, res) => {
    try {
        const { tag } = req.body;
        const tagName = await NewsTag.create({ tag });

        req.flash('success', 'Tag created successfully');
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error in CreateNewsTag:', error);
        req.flash('danger', 'Error creating tag');
        res.redirect('/admin/protected');
    }
}

exports.DeleteNewsTag = async (req, res) => {
    try {
        const tag_id = req.params.id; 
        const tag = await NewsTag.findOne({ where: { tag_id } });
        if (!tag) {
            req.flash('danger', 'Tag not found');
            return res.redirect('/admin/protected');
        }

        await tag.destroy();

        req.flash('success', 'Tag deleted successfully');
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error in DeleteNewsTag:', error);
        req.flash('danger', 'Error deleting tag');
        res.redirect('/admin/protected');
    }
}
