import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={() => { logout(); navigate('/login'); }}>Log out</button>
      ) : (
        <button onClick={() => navigate('/login')}>Log in</button>
      )}
    </div>
  );
};

export default NavBar;
