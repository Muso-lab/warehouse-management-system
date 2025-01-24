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
import WarehouseDashboard from './components/warehouse/WarehouseDashboard';
import OfficeDashboard from './components/office/OfficeDashboard';
import OfficeTaskView from './components/office/OfficeTaskView';
import Layout from './components/layout/Layout';

// Helper function per il reindirizzamento basato sul ruolo
const getDefaultRoute = (role?: string) => {
  switch (role) {
    case 'magazzino':
      return '/dashboard';
    case 'monitor':
      return '/monitor';
    case 'ufficio':
      return '/dashboard';
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
                    {/* Admin Routes */}
                    {user.role === 'admin' && (
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

                    {/* Office Routes */}
                    {user.role === 'ufficio' && (
                      <>
                        <Route
                          path="/dashboard"
                          element={
                            <Layout>
                              <OfficeDashboard />
                            </Layout>
                          }
                        />
                        <Route
                          path="/tasks"
                          element={
                            <Layout>
                              <OfficeTaskView />
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

                    {/* Warehouse Routes */}
                    {user.role === 'magazzino' && (
                      <>
                        <Route
                          path="/dashboard"
                          element={
                            <Layout>
                              <WarehouseDashboard />
                            </Layout>
                          }
                        />
                        <Route
                          path="/tasks"     // Modificato qui per corrispondere al link della sidebar
                          element={
                            <Layout>
                              <WarehouseView />
                            </Layout>
                          }
                        />
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
