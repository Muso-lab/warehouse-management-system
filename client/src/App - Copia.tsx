// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { ClientsProvider } from './context/ClientsContext';
import { TaskProvider } from './components/common/providers/TaskProvider';
import { SocketProvider } from './context/SocketContext';
import { authService } from './services/authService';
import theme from './theme';

// Importazione componenti
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskView from './pages/TaskView';
import Users from './pages/Users';
import Operators from './pages/Operators';
import Clients from './pages/Clients';
import MonitorView from './pages/MonitorView';
import WarehouseView from './components/warehouse/WarehouseView';
import WarehouseDashboard from './components/warehouse/WarehouseDashboard'; // Aggiungi questa importazione
import Layout from './components/layout/Layout';


// Helper function per il reindirizzamento basato sul ruolo
const getDefaultRoute = (role?: string) => {
  switch (role) {
    case 'magazzino':
      return '/warehouse';
    case 'monitor':
      return '/monitor';
    case 'ufficio':
      return '/tasks';
    case 'admin':
      return '/dashboard';
    default:
      return '/login';
  }
};

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <ClientsProvider>
        <TaskProvider>
          <SocketProvider>
            <Router>
              <Routes>
                {/* Login Route */}
                <Route
                  path="/login"
                  element={
                    !user ? (
                      <Login setUser={setUser} />
                    ) : (
                      <Navigate to={getDefaultRoute(user.role)} replace />
                    )
                  }
                />

                {/* Root Redirect */}
                <Route
                  path="/"
                  element={
                    <Navigate to={user ? getDefaultRoute(user.role) : '/login'} replace />
                  }
                />

                {/* Protected Routes */}
                {user && (
                  <>
                    {/* Admin and Office Routes */}
                    {(user.role === 'admin' || user.role === 'ufficio') && (
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
                        <Route
                          path="/clients"
                          element={
                            <Layout>
                              <Clients />
                            </Layout>
                          }
                        />
                      </>
                    )}

                    {/* Admin Only Routes */}
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

                    {/* Route per magazzino */}
{user.role === 'magazzino' && (
  <>
    <Route path="/dashboard" element={
      <Layout>
        <WarehouseDashboard />
      </Layout>
    } />
    <Route path="/warehouse" element={
      <Layout>
        <WarehouseView />
      </Layout>
    } />
  </>
)}

                    {/* Monitor Route */}
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
                  </>
                )}

                {/* Catch all route - redirect to appropriate page */}
                <Route
                  path="*"
                  element={
                    <Navigate to={user ? getDefaultRoute(user.role) : '/login'} replace />
                  }
                />
              </Routes>
            </Router>
          </SocketProvider>
        </TaskProvider>
      </ClientsProvider>
    </ThemeProvider>
  );
}

export default App;
