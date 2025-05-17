import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import AdminResultsPage from './pages/AdminResults';
import Login from './auth/login';
import Register from './auth/register';
import MainPage from './pages/MainPage';
import LivePage from './pages/LivePage';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';

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
        <Route path="/admin/home" element={<AdminPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />

        {/* Waiting and live pages */}
        <Route path="/main" element={<MainPage />} />
        <Route path="/live" element={<LivePage />} />
      </Routes>
    </div>
  );
};

export default App;
