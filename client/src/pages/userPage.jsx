import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import socket from '../socket/socket';

const UserPage = () => {
  const [isSinger, setIsSinger] = useState(false);
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { userName, instrument } = jwtDecode(token);

    // שליחת הודעה לשרת שהמשתמש התחבר
    socket.emit('userConnected', { userName, instrument });

    setIsSinger(instrument === 'vocals');

    // התחברות
    socket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    // ניתוק
    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from server');
    });

    // האזנה לשיר
    const eventName = instrument === 'vocals' ? 'lyrics-for-singers' : 'lyrics-for-players';
    socket.on(eventName, (data) => {
      setLyrics(data);
    });

    // ניקוי מאזינים
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off(eventName);
    };
  }, []);

  return (
    <div>
      <h1>User Page</h1>
      <p>{isSinger ? 'Welcome singer 🎤' : 'Welcome player 🎸'}</p>

      {lyrics && (
        <div>
          <h2>Lyrics:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</pre>
        </div>
      )}
    </div>
  );
};

export default UserPage;
