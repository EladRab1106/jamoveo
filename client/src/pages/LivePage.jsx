import { useEffect, useState, useRef } from 'react';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LivePage = () => {
  const navigate = useNavigate();
  const [lyrics, setLyrics] = useState('');
  const { role } = useAuth();
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && scrollContainerRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop += 1; // Adjust speed by changing this value
          
          // Stop auto-scroll when reaching the bottom
          if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setIsAutoScrolling(false);
          }
        }
      }, 50); // Adjust interval for smoother/faster scrolling
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling]);

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
      currentRole === 'admin' ? navigate('/admin/home') : navigate('/main');
    });

    return () => {
      socket.off('start-live', handleLive);
      socket.off('end-live');
    };
  }, [navigate, role]);

  const toggleAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    setIsAutoScrolling(!isAutoScrolling);
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/record.png)' }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content container */}
      <div className="relative z-10 h-screen flex flex-col p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
          🎶 {role === 'singer' ? 'מילים' : 'אקורדים'}
        </h1>

        {/* Scrollable lyrics container */}
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

        {/* Admin quit button */}
        {role === 'admin' && (
          <button
            onClick={() => socket.emit('quit-live')}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-center"
          >
            סיים שידור
          </button>
        )}

        {/* Auto-scroll toggle button */}
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
