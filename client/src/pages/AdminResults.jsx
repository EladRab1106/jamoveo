import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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

      socket.emit('start-live', {
  singerLyrics: singerRes.data.lyrics,
  playerLyrics: playerRes.data.lyricsWithChords,
});

      localStorage.setItem('singerLyrics', singerRes.data.lyrics);

setTimeout(() => {
  navigate('/live');
}, 50);
 
      


    } catch (err) {
      console.error('Error fetching song content:', err);
    }
  };

  const handleQuit = () => {
    socket.emit('quit-live');
    localStorage.removeItem('singerLyrics');
    localStorage.removeItem('playerLyrics');
    navigate('/admin/home');
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      <ul>
        {results.map((song, index) => (
          <li key={index}>
            <button onClick={() => handleClick(song.link)}>
              {song.title} - {song.artist}
            </button>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p>No results found.</p>}
      <button onClick={handleQuit}>quit</button>
    </div>
  );
};

export default AdminResultsPage;
