const NewsCategory = require('../../../../model/NewsCategory');


exports.CreateNewsCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newsCategory = new NewsCategory({ name });
        await newsCategory.save();
        req.flash('success', 'News Category created successfully');
        res.redirect('/admin/protected');
    } catch (error) {
        req.flash('danger', error.message);
        res.redirect('/admin/protected');
    }
};


exports.UpdateNewsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;
        const newsCategory = await NewsCategory.findOne({ where: { category_id: id } });
        if (!newsCategory) {
            return res.status(404).json({ message: 'News Category not found' });
        }
        newsCategory.category_name = category_name;
        await newsCategory.save();
        req.flash('success', 'News Category updated successfully');
        res.redirect('/admin/protected');
    }
    catch (error) {
        req.flash('danger', error.message);
        res.redirect('/admin/protected');
    }
}


exports.DeleteNewsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const newsCategory = await NewsCategory.findOne({ where: { category_id: id } });
        if (!newsCategory) {
            return res.status(404).json({ message: 'News Category not found' });
        }
        await newsCategory.destroy();
        req.flash('success', 'News Category deleted successfully');
        res.redirect('/admin/protected');
    }
    catch (error) {
        req.flash('danger', error.message);
        res.redirect('/admin/protected');
    }
}
