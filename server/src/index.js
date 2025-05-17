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
  'https://jamoveo-ehb6yxr18-eladrab1106s-projects.vercel.app/',
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
  console.log('🔌 Transport:', socket.conn.transport.name);
  console.log('👥 Total connected clients:', io.engine.clientsCount);

  socket.on('start-live', ({ singerLyrics, playerLyrics }) => {
    console.log('📥 Received start-live event from:', socket.id);
    console.log('👥 Broadcasting to', io.engine.clientsCount, 'clients');
    
    // Verify we have the data
    if (!singerLyrics || !playerLyrics) {
      console.error('❌ Missing lyrics data in start-live event');
      return;
    }

    // Broadcast to all clients (including sender)
    io.emit('start-live', { singerLyrics, playerLyrics });
    console.log('✅ start-live event broadcasted to all clients');
  });

  socket.on('quit-live', () => {
    console.log('📥 Received quit-live from:', socket.id);
    console.log('👥 Broadcasting end-live to', io.engine.clientsCount, 'clients');
    io.emit('end-live');
    console.log('✅ end-live event broadcasted');
  });

  socket.on('disconnect', (reason) => {
    console.log('🔴 User disconnected:', socket.id, 'Reason:', reason);
    console.log('👥 Remaining clients:', io.engine.clientsCount);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error for', socket.id, ':', error);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
