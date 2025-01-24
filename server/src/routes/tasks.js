const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get tasks by date
router.get('/date/:date', auth, async (req, res) => {  // Aggiunto async qui
  try {
    const dateStr = req.params.date;
    console.log('Backend - Requested date:', dateStr);

    const tasks = await Task.find({ date: dateStr });
    console.log('Backend - Found tasks:', tasks);

    res.json(tasks);
  } catch (error) {
    console.error('Backend - Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get task stats
router.get('/stats', auth, async (req, res) => {  // Aggiunto async qui
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
    console.error('Backend - Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    console.log('Backend - Received task data:', req.body);

    const task = new Task({
      serviceType: req.body.serviceType,
      vehicleData: req.body.vehicleData,
      clients: req.body.clients,
      priority: req.body.priority,
      status: req.body.status || 'pending',
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      officeNotes: req.body.officeNotes,
      warehouseNotes: req.body.warehouseNotes
    });

    console.log('Backend - Created task object:', task);

    const savedTask = await task.save();
    console.log('Backend - Saved task:', savedTask);

    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Backend - Error details:', error);
    res.status(400).json({
      message: 'Error creating task',
      error: error.message,
      details: error.errors
    });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {  // Aggiunto async qui
  try {
    console.log('Backend - Updating task:', req.params.id, 'with data:', req.body);
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Backend - Updated task:', task);
    res.json(task);
  } catch (error) {
    console.error('Backend - Error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {  // Aggiunto async qui
  try {
    console.log('Backend - Deleting task:', req.params.id);
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Backend - Deleted task:', req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Backend - Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
