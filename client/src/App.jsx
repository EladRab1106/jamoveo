import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage'
import UserPage from './pages/userPage';
import Login from './auth/login';
import Register from './auth/register';
import AdminResultsPage from './pages/AdminResults';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/home" element={<AdminPage />} />
        <Route path="/user/home" element={<UserPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />
      </Routes>
    </div>
  );
};

export default App;
