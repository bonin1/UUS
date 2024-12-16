const TasksModel = require('../../model/TaskModel');


exports.TaskPath = async (req, res) => {
    try {
        const tasks = await TasksModel.findAll();
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'An error occurred while fetching tasks' });
    }
};