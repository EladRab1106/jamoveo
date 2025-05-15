import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <div>
      <h2>{isAdmin ? 'Admin' : 'User'} Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <br />
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        {!isAdmin && (
          <>
            <label>Instrument:</label>
            <select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
              <option value="none">None</option>
              <option value="guitar">Guitar</option>
              <option value="piano">Piano</option>
              <option value="drums">Drums</option>
              <option value="bass">Bass</option>
              <option value="vocals">Vocals</option>
            </select>
            <br />
          </>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
