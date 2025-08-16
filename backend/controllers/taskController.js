const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ date: 1, time: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

const addTask = async (req, res) => {
  const { fullName, doctor, appointmentType, date, time, notes } = req.body;
  
  try {
    // Check if the doctor is already booked at the selected time
    const existingTask = await Task.findOne({
      doctor,
      date,
      time
    });

    if (existingTask) {
      return res.status(400).json({ message: "The doctor is already booked at this time." });
    }

    // Create a new task if no conflict is found
    const task = await Task.create({
      userId: req.user.id,
      fullName, doctor, appointmentType, date, time, notes
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create appointment." });
  }
};

const updateTask = async (req, res) => {
  const { fullName, doctor, appointmentType, date, time, notes, completed } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Ensure the logged-in user is the one who created the task
    if (String(task.userId) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });

    // Only check for conflicts if doctor or time is updated
    if ((doctor && doctor !== task.doctor) || (time && time !== task.time) || (date && date !== task.date)) {
      const existingTask = await Task.findOne({
        doctor,
        date,
        time,
        _id: { $ne: task._id } // Exclude the current task from the check (so it doesn't conflict with itself)
      });

      if (existingTask) {
        return res.status(400).json({ message: "The doctor is already booked at this time." });
      }
    }

    // Update the task with the new data if provided
    if (fullName !== undefined) task.fullName = fullName;
    if (doctor !== undefined) task.doctor = doctor;
    if (appointmentType !== undefined) task.appointmentType = appointmentType;
    if (date !== undefined) task.date = date;
    if (time !== undefined) task.time = time;
    if (notes !== undefined) task.notes = notes;
    if (completed !== undefined) task.completed = completed;

    // Save the updated task
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update appointment." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Make sure the task belongs to the logged-in user
    if (String(task.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await task.remove();  // Remove task from database
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
