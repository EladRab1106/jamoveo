import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ socket connected inside socket.js:', socket.id)
  ;
  
});

export default socket;
