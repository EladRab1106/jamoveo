// ProtectedAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { token, role, isLoading } = useAuth();

  if (isLoading) return null;

  if (!token || role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedAdminRoute;
