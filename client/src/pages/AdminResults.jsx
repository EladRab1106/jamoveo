import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket/socket'; 
import axios from '../api/serverApi';

const AdminResultsPage = () => {
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

      socket.emit('send-lyrics', {
        singerLyrics: singerRes.data.lyrics,
        playerLyrics: playerRes.data.lyricsWithChords,
      });

    } catch (err) {
      console.error('Error fetching song content:', err);
    }
  };

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
    </div>
  );
};

export default AdminResultsPage;
