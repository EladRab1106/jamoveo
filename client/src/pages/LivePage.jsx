import { useEffect, useState } from 'react';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LivePage = () => {
  const navigate = useNavigate();
  const [lyrics, setLyrics] = useState('');
  const { role } = useAuth();

  useEffect(() => {

    const lyricsKey = role === 'singer' || role === 'admin' ? 'singerLyrics' : 'playerLyrics';
    const savedLyrics = localStorage.getItem(lyricsKey);
    if (savedLyrics) {
      setLyrics(savedLyrics);
    }

    const handleLive = ({ singerLyrics, playerLyrics }) => {
      const currentRole = role; 
      const updatedLyrics = currentRole === 'singer' ? singerLyrics : playerLyrics;


      const key = currentRole === 'singer' ? 'singerLyrics' : 'playerLyrics';
      localStorage.setItem(key, updatedLyrics);

      setLyrics(updatedLyrics);
    };

    socket.on('start-live', handleLive);

    socket.on('end-live', () => {
      const currentRole = role;
      localStorage.removeItem('singerLyrics');
      localStorage.removeItem('playerLyrics');
      currentRole==='admin' ? navigate('/admin/home') :navigate('/main');
      
    });

    return () => {
      socket.off('start-live', handleLive);
      socket.off('end-live');
    };
  }, [navigate, role]);

  return (
    <div>
      <h1>🎶 Live Lyrics</h1>
      {lyrics ? (
        <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</pre>
      ) : (
        <p>אין כרגע שיר להצגה.</p>
      )}

      {role === 'admin' && (
        <button
          onClick={() => {
            socket.emit('quit-live');
          }}
        >
          סיים שידור
        </button>
      )}
    </div>
  );
};

export default LivePage;
