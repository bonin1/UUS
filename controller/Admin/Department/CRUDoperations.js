const Department = require('../../../model/DepartmentModel');

exports.createDepartment = async (req, res) => {
    const { dep_name } = req.body;
    if (!dep_name) {
        return res.status(400).json({ message: 'Department name is required' });
    }
    try {
        const newDepartment = await Department.create({ dep_name });
        req.flash('success', 'Department created successfully!');
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error creating department:', error);
        req.flash('danger', 'Error creating department');
        res.redirect('/admin/protected');
    }
};

exports.updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { dep_name } = req.body;
    if (!dep_name) {
        return res.status(400).json({ message: 'Department name is required' });
    }
    try {
        const department = await Department.findByPk(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        department.dep_name = dep_name;
        await department.save();
        req.flash('success', 'Department updated successfully!');
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error updating department:', error);
        req.flash('danger', 'Error updating department');
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await Department.findByPk(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        await department.destroy();
        req.flash('success', 'Department deleted successfully!');
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error deleting department:', error);
        req.flash('danger', 'Error deleting department');
        res.status(500).json({ message: 'Internal server error' });
    }
};