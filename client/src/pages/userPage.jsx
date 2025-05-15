import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import socket from '../socket/socket';

const UserPage = () => {
  const [isSinger, setIsSinger] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { userName, instrument } = jwtDecode(token);

    // שליחת הודעה לשרת שהמשתמש התחבר
    socket.emit('userConnected', { userName, instrument });

    // התחברות
    socket.on('connect', () => {
      console.log('🔌 Connected to server');
    });

    // ניתוק
    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from server');
    });

    // בדיקה אם המשתמש זמר
    setIsSinger(instrument === 'vocals');

    // ניקוי מאזינים
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>User Page</h1>
      {isSinger ? (
        <p>Welcome singer 🎤</p>
      ) : (
        <p>Welcome player 🎸</p>
      )}
    </div>
  );
};

export default UserPage;
