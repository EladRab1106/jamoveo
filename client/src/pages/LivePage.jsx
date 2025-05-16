import { useEffect, useState } from 'react';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';

const LivePage = () => {
  const navigate = useNavigate();
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    // טען מילים שכבר קיימות
    const role = localStorage.getItem('role');
    const lyricsKey = role === 'singer' ? 'singerLyrics' : 'playerLyrics';
    const savedLyrics = localStorage.getItem(lyricsKey);
    if (savedLyrics) {
      setLyrics(savedLyrics);
    }

    // האזנה לשיר חדש מהשרת
    const handleLive = ({ singerLyrics, playerLyrics }) => {
      const currentRole = localStorage.getItem('role'); // ❗ שליפה מחדש
      const updatedLyrics = currentRole === 'singer' ? singerLyrics : playerLyrics;

      // שמירה בלוקאל סטורג' לטובת רענון
      const key = currentRole === 'singer' ? 'singerLyrics' : 'playerLyrics';
      localStorage.setItem(key, updatedLyrics);

      // עדכון מיידי
      setLyrics(updatedLyrics);
    };

    socket.on('start-live', handleLive);

    socket.on('end-live', () => {
      const currentRole = localStorage.getItem('role');
      const key = currentRole === 'singer' ? 'singerLyrics' : 'playerLyrics';
      setLyrics('');
      localStorage.removeItem(key);
      navigate('/main');
    });

    return () => {
      socket.off('start-live', handleLive);
      socket.off('end-live');
    };
  }, [navigate]);

  return (
    <div>
      <h1>🎶 Live Lyrics</h1>
      {lyrics ? (
        <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</pre>
      ) : (
        <p>אין כרגע שיר להצגה.</p>
      )}
    </div>
  );
};

export default LivePage;
