import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskView from './pages/TaskView';
import Users from './pages/Users';
import Operators from './pages/Operators';
import Clients from './pages/Clients';
import MonitorView from './pages/MonitorView';
import WarehouseView from './components/warehouse/WarehouseView';
import theme from './theme';
import { ClientsProvider } from './context/ClientsContext';
import { authService } from './services/authService';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';

const AppRoutes = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log('Current user:', currentUser);
    setUser(currentUser);
    setAuthChecked(true);
  }, []);

  const getDefaultRoute = (userRole?: string) => {
    switch (userRole) {
      case 'magazzino':
        return '/warehouse';
      case 'monitor':
        return '/monitor';
      case 'office':
      case 'admin':
      default:
        return '/dashboard';
    }
  };

  if (!authChecked) {
    return null;
  }

  if (!user && window.location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser} />} />

      {user && (
        <>
          {/* Route per admin e office */}
          {(user.role === 'admin' || user.role === 'office') && (
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

          {/* Route solo per admin */}
          {user.role === 'admin' && (
            <>
              <Route
                path="/users"
                element={
                  <Layout>
                    <Users />
                  </Layout>
                }
              />
              <Route
                path="/operators"
                element={
                  <Layout>
                    <Operators />
                  </Layout>
                }
              />
            </>
          )}

          {/* Route per Gestione Clienti (admin e office) */}
          {(user.role === 'admin' || user.role === 'office') && (
            <Route
              path="/clients"
              element={
                <Layout>
                  <Clients />
                </Layout>
              }
            />
          )}

          {/* Route per magazzino */}
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

          {/* Route per monitor */}
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
              <Navigate to={getDefaultRoute(user.role)} replace />
            }
          />
        </>
      )}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Creiamo un wrapper component che fornisce il contesto del router
const AppWrapper = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
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
