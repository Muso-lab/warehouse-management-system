// client/src/components/layout/Layout.tsx
import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { authService } from '../../services/authService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Prima rimuoviamo i dati di autenticazione
    authService.logout();
    // Poi forziamo il refresh della pagina e reindirizziamo al login
    window.location.href = '/login';
    // In alternativa: navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onLogout={handleLogout} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          mt: '64px'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
