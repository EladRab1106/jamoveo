import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage'
import UserPage from './pages/userPage';
import Login from './auth/login';
import Register from './auth/register';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/home" element={<AdminPage />} />
        <Route path="/user/home" element={<UserPage />} />
      </Routes>
    </div>
  );
};

export default App;
