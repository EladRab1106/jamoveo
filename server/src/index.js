import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import AuthRouter from './routes/authRoutes.js';
import SongRouter from './routes/songRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// API routes
app.use('/api/auth', AuthRouter);
app.use('/api', SongRouter);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // או מה שיהיה בעתיד
    methods: ['GET', 'POST'],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('send-lyrics', ({ singerLyrics, playerLyrics }) => {
    console.log('📤 Sending lyrics to singers and players');
    io.emit('lyrics-for-singers', singerLyrics);
    io.emit('lyrics-for-players', playerLyrics);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
