const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Esclude la password dai risultati
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new user
router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password, // Nota: in produzione, questo dovrebbe essere criptato
    role: req.body.role,
    active: req.body.active
  });

  try {
    const newUser = await user.save();
    const userResponse = newUser.toObject();
    delete userResponse.password; // Non inviare la password nella risposta
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      username: req.body.username,
      role: req.body.role,
      active: req.body.active
    };

    // Aggiorna la password solo se fornita
    if (req.body.password) {
      updateData.password = req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
