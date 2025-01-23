import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskView from './pages/TaskView'; // Assicurati che questo import sia corretto
import Users from './pages/Users';
import MonitorView from './pages/MonitorView';
import WarehouseView from './components/warehouse/WarehouseView';
import theme from './theme';
import { ClientsProvider } from './context/ClientsContext';
import { authService } from './services/authService';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';

const AppRoutes = () => {
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return null;
  }

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser} />} />

      {user && (
        <>
          {/* Rotte comuni per admin e office */}
          {(user.role === 'office' || user.role === 'admin') && (
            <>
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/tasks"
                element={
                  <Layout>
                    <TaskView />
                  </Layout>
                }
              />
            </>
          )}

          {/* Rotte specifiche per ruolo */}
          {user.role === 'admin' && (
            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
          )}

          {user.role === 'magazzino' && (
            <Route
              path="/warehouse"
              element={
                <Layout>
                  <WarehouseView />
                </Layout>
              }
            />
          )}

          {user.role === 'monitor' && (
            <Route
              path="/monitor"
              element={
                <Layout>
                  <MonitorView />
                </Layout>
              }
            />
          )}

          {/* Rotta di default */}
          <Route
            path="/"
            element={
              <Navigate
                to={user.role === 'magazzino' ? '/warehouse' : '/dashboard'}
                replace
              />
            }
          />
        </>
      )}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClientsProvider>
        <SocketProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SocketProvider>
      </ClientsProvider>
    </ThemeProvider>
  );
}

export default App;
