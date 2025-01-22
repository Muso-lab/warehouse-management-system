const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients.map(client => client.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new client
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Client name is required' });
    }

    const existingClient = await Client.findOne({ name });
    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const client = new Client({ name });
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete client
router.delete('/:name', async (req, res) => {
  try {
    const result = await Client.findOneAndDelete({ name: req.params.name });
    if (!result) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
