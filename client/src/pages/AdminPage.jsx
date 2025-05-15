import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/admin/results?query=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search a song..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default AdminPage;
