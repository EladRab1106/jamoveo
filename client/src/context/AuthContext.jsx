// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    token: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      setAuth({ isLoggedIn: true, role, token });
    }

    setIsLoading(false); // טעינה הסתיימה
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuth({ isLoggedIn: true, role, token });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ isLoggedIn: false, role: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
