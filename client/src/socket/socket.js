import { io } from 'socket.io-client';

const socket = import.meta.env.PROD
  ? io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
    })
  : null; // או false, או לא לעשות כלום בלוקאלי

export default socket;
