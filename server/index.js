require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing JSON requests

// Add a dummy login route (for demonstration)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Basic fake validation logic
  if (username === 'admin' && password === 'admin123') {
    return res.status(200).json({ message: 'Login successful', user: { username } });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let onlineUsers = {};

// Handle socket connections
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('login', username => {
    onlineUsers[socket.id] = username;
    io.emit('user-list', Object.values(onlineUsers));
    io.emit('notification', `${username} joined`);
  });

  socket.on('chat message', msg => {
    const payload = { ...msg, id: socket.id, time: new Date().toISOString() };
    io.emit('chat message', payload);
  });

  socket.on('typing', username => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    const name = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit('user-list', Object.values(onlineUsers));
    io.emit('notification', `${name} left`);
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
