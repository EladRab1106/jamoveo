import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const NavBar = () => {
  const { isLoggedIn, logout, role } = useAuth();
  const navigate = useNavigate();

  // Helper function to get role display text in Hebrew
  const getRoleDisplay = () => {
    switch (role) {
      case 'admin':
        return 'מנהל';
      case 'singer':
        return 'זמר';
      case 'player':
        return 'נגן';
      default:
        return '';
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm bg-black/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - conditionally wrapped in Link */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 text-white/70">
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-xl hidden sm:block">Jamoveo</span>
            </div>
          ) : (
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
            >
              <span className="text-2xl">🎵</span>
              <span className="font-bold text-xl hidden sm:block">Jamoveo</span>
            </Link>
          )}

          {/* Center section - Role display when logged in */}
          {isLoggedIn && role && (
            <div className="hidden sm:flex items-center">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
                {getRoleDisplay()}
              </span>
            </div>
          )}

          {/* Right section - Auth buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Role indicator for mobile */}
                <span className="sm:hidden px-2 py-1 rounded-full bg-white/10 text-white text-sm">
                  {getRoleDisplay()}
                </span>
                
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
                >
                  התנתק
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 text-sm font-medium"
              >
                התחבר
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
