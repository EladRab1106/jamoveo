import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import serverApi from '../api/serverApi';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('none');

  const isAdmin = location.pathname.includes('/admin');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!userName.trim() || !email.trim() || !password.trim()) {
      alert('כל השדות הם חובה');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('כתובת האימייל אינה תקינה');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    const endpoint = isAdmin ? '/auth/admin/register' : '/auth/register';

    try {
      await serverApi.post(endpoint, {
        userName,
        email,
        password,
        instrument: isAdmin ? 'none' : instrument,
      });

      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
         style={{ backgroundImage: 'url(/mainBG.png)' }}>
      <div className="w-full max-w-md p-8 rounded-xl backdrop-blur-sm bg-black/30">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          {isAdmin ? 'הרשמת מנהל' : 'הרשמה'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="block text-white text-right">שם משתמש</label>
            <input
              value={userName}
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              onChange={(e) => setUserName(e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white text-right">אימייל</label>
            <input
              value={email}
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              onChange={(e) => setEmail(e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-white text-right">סיסמה</label>
            <input
              type="password"
              value={password}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
            />
          </div>

          {!isAdmin && (
            <div className="space-y-2">
              <label className="block text-white text-right">כלי נגינה</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/50 transition-colors"
                dir="rtl"
              >
                <option value="" disabled hidden>בחר כלי נגינה</option>
                    <option value="guitar">גיטרה</option>
                    <option value="piano">פסנתר</option>
                    <option value="drums">תופים</option>
                    <option value="bass">בס</option>
                    <option value="vocals">שירה</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            הירשם
          </button>

          <p className="text-white text-center mt-4">
            כבר יש לך חשבון?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              התחבר כאן
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;