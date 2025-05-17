import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import AuthRouter from './routes/authRoutes.js';
import SongRouter from './routes/songRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

// Create Express app
const app = express();

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://jamoveo-three.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.send('🎧 Jamoveo API is running!');
});

// API routes
app.use('/api/auth', AuthRouter);
app.use('/api', SongRouter);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // במקום רשימה סגורה
    methods: ['GET', 'POST'],
  },
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('start-live', ({ singerLyrics, playerLyrics }) => {
  console.log('📤 start-live triggered by', socket.id);
    io.emit('start-live', { singerLyrics, playerLyrics });
  });

  socket.on('quit-live', () => {
    console.log('📤 Sending quit-live to all clients');
    io.emit('end-live');
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
