import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../socket/socket'; 
import axios from '../api/serverApi';

const AdminResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(res.data.results);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleClick = async (link) => {
    try {
      const [singerRes, playerRes] = await Promise.all([
        axios.get(`/song?link=${encodeURIComponent(link)}&role=singer`),
        axios.get(`/song?link=${encodeURIComponent(link)}&role=player`)
      ]);

      // if (socket) {
        socket.emit('start-live', {
          singerLyrics: singerRes.data.lyrics,
          playerLyrics: playerRes.data.lyricsWithChords,
        });
      // }

      localStorage.setItem('singerLyrics', singerRes.data.lyrics);

      setTimeout(() => {
        navigate('/live');
      }, 50);
    } catch (err) {
      console.error('Error fetching song content:', err);
    }
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
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/mainBG.png)' }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              🔍 תוצאות חיפוש
            </h2>
            <p className="text-white/90 text-lg">
              {`חיפוש עבור "${query}"`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((song, index) => (
                    <div 
                      key={index}
                      className="backdrop-blur-sm bg-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/20"
                    >
                      <button 
                        onClick={() => handleClick(song.link)}
                        className="w-full text-right"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-white">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold">{song.title}</h3>
                            <p className="text-white/80">{song.artist}</p>
                          </div>
                          <div className="text-blue-400 hover:text-blue-300 transition-colors">
                            בחר ▶
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white text-xl">
                  לא נמצאו תוצאות.
                </div>
              )}

              <div className="mt-8 flex justify-between gap-4">
                <button
                  onClick={() => navigate('/admin/home')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  ← חזור לחיפוש
                </button>
                
                <button
                  onClick={handleQuit}
                  className="px-6 py-3 bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg transition-colors"
                >
                  סיים שידור
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminResultsPage;
