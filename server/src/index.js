const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

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
const authRouter = require('./routes/auth');

// Store active users
const activeUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('userConnected', (userData) => {
    activeUsers.set(socket.id, {
      userId: userData.userId,
      username: userData.username,
      role: userData.role,
      connectedAt: new Date()
    });

    // Broadcast updated users list
    io.emit('activeUsers', Array.from(activeUsers.values()));
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('activeUsers', Array.from(activeUsers.values()));
    console.log('Client disconnected');
  });
});

// Use routes
app.use('/api/tasks', tasksRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
