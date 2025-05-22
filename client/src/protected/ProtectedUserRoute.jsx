// ProtectedUserRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedUserRoute = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return null; // או אפשר להחזיר spinner

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedUserRoute;
