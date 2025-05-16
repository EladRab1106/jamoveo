import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import AdminResultsPage from './pages/AdminResults';
import UserPage from './pages/userPage';
import Login from './auth/login';
import Register from './auth/register';
import MainPage from './pages/MainPage';
import LivePage from './pages/LivePage';

const App = () => {
  return (
    <div>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/home" element={<AdminPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />

        {/* User */}
        <Route path="/user/home" element={<UserPage />} />

        {/* Waiting and live pages */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/live" element={<LivePage />} />
      </Routes>
    </div>
  );
};

export default App;
