import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || !role) {
      navigate('/login');
      return;
    }


    // שמירה גם של התפקיד וגם של המילים לפי התפקיד
    socket.on('start-live', ({ singerLyrics, playerLyrics }) => {
      const isSinger = role === 'singer';

      localStorage.setItem('role', isSinger ? 'singer' : 'player');
      localStorage.setItem('singerLyrics', singerLyrics);
      localStorage.setItem('playerLyrics', playerLyrics);

      navigate('/live');
    });

    return () => {
      socket.off('start-live');
    };
  }, [navigate]);

  return <h2>מחכים לבחירת שיר על ידי האדמין...</h2>;
};

export default MainPage;
