import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serverApi from '../api/serverApi';

const Login = () => {
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        value={userName}
        type="text"
        id="username"
        name="username"
        required
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        value={password}
        type="password"
        id="password"
        name="password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
