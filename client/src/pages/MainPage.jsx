import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useAuth } from '../context/AuthContext';

const MainPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    console.log('✅ useEffect התחיל');
    console.log('🌐 VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);

    const token = localStorage.getItem('token');
    console.log('🔐 token:', token);
    console.log('🧑‍🎤 role:', role);

    if (!token || !role) {
      console.warn('⛔ חסר token או role - מעבר ל-login');
      navigate('/login');
      return;
    }

    console.log('🟢 ממשיך - socket:', socket);

    // Socket connection handler
    const handleConnect = () => {
      console.log('✅ socket connected:', socket.id);
    };

    // Start-live event handler
    const handleStartLive = ({ singerLyrics, playerLyrics }) => {
      console.log('📥 Received start-live event');
      console.log('👤 Current role:', role);
      
      // Store appropriate lyrics based on role
      if (role === 'singer') {
        console.log('🎤 Storing singer lyrics');
        localStorage.setItem('singerLyrics', singerLyrics);
      } else {
        console.log('🎸 Storing player lyrics');
        localStorage.setItem('playerLyrics', playerLyrics);
      }

      console.log('🔄 Navigating to /live');
      navigate('/live');
    };

    // Set up event listeners
    socket?.on('connect', handleConnect);
    socket?.on('start-live', handleStartLive);

    // Cleanup event listeners
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket?.off('connect', handleConnect);
      socket?.off('start-live', handleStartLive);
    };
  }, [navigate, role]);

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: 'url(/lobby.png)' }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content container */}
      <div className="relative z-10 text-center p-6 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          מחכים לבחירת שיר על ידי האדמין...
        </h2>
        
        {/* Loading animation */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
