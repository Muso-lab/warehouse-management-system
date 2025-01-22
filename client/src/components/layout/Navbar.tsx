import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Theme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const styles = {
  appBar: (theme: Theme) => ({
    zIndex: theme.zIndex.drawer + 1
  }),
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  }
} as const;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = React.useCallback(async () => {
    try {
      authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <AppBar position="fixed" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <Typography variant="h6" component="div">
          Warehouse Management
        </Typography>
        <Box sx={styles.userSection}>
          <Typography variant="body1">
            {user.username}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            aria-label="logout"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
