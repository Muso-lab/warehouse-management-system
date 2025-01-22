import React from 'react';
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

// Stili costanti estratti
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

interface NavbarProps {
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  userName = 'test@user' // default value
}) => {
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    // Qui puoi aggiungere la logica di logout
    // Per esempio, pulire il localStorage, resettare lo stato dell'app, etc.
    localStorage.removeItem('token'); // se usi token
    navigate('/login');
  }, [navigate]);

  return (
    <AppBar position="fixed" sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <Typography
          variant="h6"
          component="div"
        >
          Warehouse Management
        </Typography>
        <Box sx={styles.userSection}>
          <Typography variant="body1">
            {userName}
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
