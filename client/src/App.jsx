import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import AdminResultsPage from './pages/AdminResults';
import Login from './auth/login';
import Register from './auth/register';
import MainPage from './pages/MainPage';
import LivePage from './pages/LivePage';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ProtectedAdminRoute from './protected/ProtectedAdminRoute';
import ProtectedUserRoute from './protected/ProtectedUserRoute'

const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        {/* Authentication */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/home" element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/results" element={
          <ProtectedAdminRoute>
            <AdminResultsPage />
          </ProtectedAdminRoute>
        } />

        {/* Waiting and live pages */}
        <Route path="/main" element={
          <ProtectedUserRoute>
            <MainPage />
          </ProtectedUserRoute>
        } />
        <Route path="/live" element={
          <ProtectedUserRoute>
            <LivePage />
          </ProtectedUserRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
