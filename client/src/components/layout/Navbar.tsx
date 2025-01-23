import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { LogoutOutlined } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          LL Warehouse Task Management
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mr: 2,
                textTransform: 'capitalize',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {user.username} ({user.role})
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutOutlined />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                textTransform: 'none',
                fontWeight: 'medium'
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
