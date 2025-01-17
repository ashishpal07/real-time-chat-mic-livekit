import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
dotenv.config();


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
    io.to(roomName).emit('message', 'A new user joined the room');
  });

  socket.on('send-message', ({ roomName, message }) => {
    io.to(roomName).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
