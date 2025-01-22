const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ name: 1 });
    res.json(clients.map(client => client.name));
  } catch (error) {
    console.error('Error fetching clients:', error);
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
    console.log('Client saved:', savedClient);
    res.status(201).json(savedClient);
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete client
router.delete('/:name', async (req, res) => {
  try {
    console.log('Attempting to delete client:', req.params.name);
    const deletedClient = await Client.findOneAndDelete({ name: req.params.name });

    if (!deletedClient) {
      console.log('Client not found:', req.params.name);
      return res.status(404).json({ message: 'Client not found' });
    }

    console.log('Client deleted successfully:', deletedClient);
    res.json({ message: 'Client deleted successfully', client: deletedClient });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
