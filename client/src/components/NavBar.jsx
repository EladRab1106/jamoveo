import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  if (!isLoggedIn) return null;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#eee',
      borderBottom: '1px solid #ccc'
    }}>
      <div>
        {role === 'admin' ? '👑 Admin Panel' : role === 'singer' ? '🎤 Singer' : '🎸 Player'}
      </div>
      <button onClick={handleAuthClick}>Logout</button>
    </nav>
  );
};

export default NavBar;
