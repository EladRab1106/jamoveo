import { useEffect, useState, useRef } from 'react';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LivePage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [lyrics, setLyrics] = useState('');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Scroll animation
  useEffect(() => {
    if (isAutoScrolling && scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop += 1;
          if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setIsAutoScrolling(false);
          }
        }
      }, 50);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling]);

  // Handle lyrics loading and socket events
  useEffect(() => {
    const lyricsKey = role === 'singer' || role === 'admin' ? 'singerLyrics' : 'playerLyrics';
    const savedLyrics = localStorage.getItem(lyricsKey);
    if (savedLyrics) {
      setLyrics(savedLyrics);
    }

    if (!socket) return;

    const handleStartLive = ({ singerLyrics, playerLyrics }) => {
      const updatedLyrics = role === 'singer' || role === 'admin' ? singerLyrics : playerLyrics;
      const key = role === 'singer' || role === 'admin' ? 'singerLyrics' : 'playerLyrics';
      localStorage.setItem(key, updatedLyrics);
      setLyrics(updatedLyrics);
    };

    const handleEndLive = () => {
      localStorage.removeItem('singerLyrics');
      localStorage.removeItem('playerLyrics');
      navigate(role === 'admin' ? '/admin/home' : '/main');
    };

    socket.on('start-live', handleStartLive);
    socket.on('end-live', handleEndLive);

    return () => {
      socket.off('start-live', handleStartLive);
      socket.off('end-live', handleEndLive);
    };
  }, [navigate, role]);

  const toggleAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    setIsAutoScrolling(!isAutoScrolling);
  };

  const handleQuit = () => {
    if (socket) {
      socket.emit('quit-live');
    }
    localStorage.removeItem('singerLyrics');
    localStorage.removeItem('playerLyrics');
    navigate('/admin/home');
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/record.png)' }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 h-screen flex flex-col p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
          🎶 {role === 'singer' ? 'מילים' : 'אקורדים'}
        </h1>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto rounded-lg backdrop-blur-sm bg-black/30 p-6"
        >
          {lyrics ? (
            <pre className="text-white text-lg whitespace-pre-wrap font-mono leading-relaxed text-right">
              {lyrics}
            </pre>
          ) : (
            <p className="text-white text-center text-xl">אין כרגע שיר להצגה.</p>
          )}
        </div>

        {role === 'admin' && (
          <button
            onClick={handleQuit}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-center"
          >
            סיים שידור
          </button>
        )}

        {lyrics && (
          <button
            onClick={toggleAutoScroll}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              isAutoScrolling
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title={isAutoScrolling ? 'עצור גלילה אוטומטית' : 'הפעל גלילה אוטומטית'}
          >
            <span className="text-white text-2xl">
              {isAutoScrolling ? '⏹' : '⏵'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LivePage;
