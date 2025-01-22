import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import MonitorView from './pages/MonitorView';
import theme from './theme';
import { ClientsProvider } from './context/ClientsContext';
import { authService } from './services/authService';

const AppRoutes = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated() && window.location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          user?.role === 'monitor'
            ? <MonitorView />
            : <Dashboard />
        }
      />
      <Route path="/tasks" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClientsProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ClientsProvider>
    </ThemeProvider>
  );
}

export default App;
