const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Import routes
const tasksRouter = require('./routes/tasks');
const clientsRouter = require('./routes/clients');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');  // Aggiunto il nuovo router

// Use routes
app.use('/api/tasks', tasksRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);  // Aggiunta la nuova route

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
