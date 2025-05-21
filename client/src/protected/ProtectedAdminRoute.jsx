import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedAdminRoute = ({ children }) => {
  const { role } = useAuth();
  const token = localStorage.getItem('token');

  if (!token || role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

export const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};
