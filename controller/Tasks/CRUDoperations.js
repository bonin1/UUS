const TasksModel = require('../../model/TaskModel');


exports.InsertTask = async(req,res)=>{
    const { taskName, scheduledTime, duration } = req.body;
    const endTime = new Date(new Date(scheduledTime).getTime() + (duration * 24 * 60 * 60 * 1000));

    try {
        const newTask = await TasksModel.create({
            task_name: taskName,
            scheduled_time: scheduledTime,
            end_time: endTime
        });
        res.redirect('/protected')
    } catch (err) {
        console.error('Error adding task:', err);
        res.status(500).json({ error: 'An error occurred while adding the task' });
    }
}


exports.DeleteTask = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin');
    }
    const taskId = req.params.id;

    try {
        const deletedTask = await TasksModel.destroy({ where: { id: taskId } });
        if (deletedTask === 0) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.redirect('/admin/protected')
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'An error occurred while deleting the task' });
    }
};