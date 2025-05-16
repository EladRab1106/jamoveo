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
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: 'url(/mainBG.png)' }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🎵 חיפוש שירים
          </h1>
          <p className="text-white/90 text-lg">
            חפש שיר לפי שם או אמן
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="הקלד שם שיר או אמן..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors text-right"
              dir="rtl"
            />
            <button 
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              חפש
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
