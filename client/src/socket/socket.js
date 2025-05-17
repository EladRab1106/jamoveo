import { io } from 'socket.io-client';

let socket = null;

if (import.meta.env.PROD && import.meta.env.VITE_SOCKET_URL) {
  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ['websocket'],
  });
}

export default socket;
