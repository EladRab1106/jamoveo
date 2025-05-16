import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import serverApi from '../api/serverApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await serverApi.post('/auth/login', {
        userName,
        password
      });

      const token = response.data.token;
      if (!token) {
        return alert('Login failed. No token received.');
      }

      localStorage.setItem('token', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const { role } = payload;

      localStorage.setItem('role', role);
      login(token, role);

      if (role === 'admin') {
        navigate('/admin/home');
      } else {
        navigate('/main');
      }

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
         style={{ backgroundImage: 'url(/mainBG.png)' }}>
      <div className="w-full max-w-md p-8 rounded-xl backdrop-blur-sm bg-black/30">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">התחברות</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-white text-right">שם משתמש</label>
            <input
              value={userName}
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              onChange={(e) => setUserName(e.target.value)}
              dir="rtl"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-white text-right">סיסמה</label>
            <input
              value={password}
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            התחבר
          </button>

          <p className="text-white text-center mt-4">
            אין לך חשבון?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              הירשם כאן
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
