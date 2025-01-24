// client/src/components/layout/Navbar.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { authService } from '../../services/authService';

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const currentUser = authService.getCurrentUser();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme => theme.palette.primary.main,
      }}
    >
      <Toolbar sx={{
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Logo/Titolo */}
        <Typography
          variant="h4"
          noWrap
          component="div"
          sx={{
            fontSize: '1.8rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: 'white',
            flexGrow: 1
          }}
        >
          LL Warehouse Task Management
        </Typography>

        {/* Box per username e logout */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3
        }}>
          {/* Username */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: 'white',
              textTransform: 'uppercase'
            }}
          >
            {currentUser?.username || ''}
          </Typography>

          {/* Logout button */}
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={onLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
