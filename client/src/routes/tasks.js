const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get tasks by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    console.log('Backend - Received date:', req.params.date);
    const date = new Date(req.params.date);
    console.log('Backend - Parsed date:', date);

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log('Backend - Query range:', {
      startOfDay,
      endOfDay
    });

    // Prima verifichiamo tutti i task senza filtro per data
    const allTasks = await Task.find();
    console.log('Backend - All tasks in DB:', allTasks.length);

    // Poi facciamo la query filtrata
    const tasks = await Task.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ date: 1 });

    console.log('Backend - Found tasks for date:', tasks.length);
    console.log('Backend - Tasks:', tasks);

    res.json(tasks);
  } catch (error) {
    console.error('Backend - Error in /date/:date route:', error);
    res.status(500).json({
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get task stats
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'completed' });
    const inProgress = await Task.countDocuments({ status: 'in_progress' });
    const pending = await Task.countDocuments({ status: 'pending' });

    res.json({
      total,
      completed,
      inProgress,
      pending
    });
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    res.status(500).json({ message: 'Error fetching task statistics' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
