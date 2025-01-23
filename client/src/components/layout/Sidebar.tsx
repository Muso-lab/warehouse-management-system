import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TasksIcon,
  Settings as SettingsIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import ClientsManager from '../settings/ClientsManager';
import { useClients } from '../../context/ClientsContext';
import { authService } from '../../services/authService';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClientsManagerOpen, setIsClientsManagerOpen] = useState(false);
  const { clients, updateClients } = useClients();
  const user = authService.getCurrentUser();

  if (user?.role === 'monitor') {
    return null;
  }

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      show: user?.role === 'admin' || user?.role === 'office'
    },
    {
      text: 'Task',
      icon: <TasksIcon />,
      path: '/tasks',
      show: user?.role !== 'monitor'
    },
    {
      text: 'Utenti',
      icon: <UsersIcon />,
      path: '/users',
      show: user?.role === 'admin'
    }
  ].filter(item => item.show);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSaveClients = (newClients: string[]) => {
    updateClients(newClients);
  };

  const canManageClients = user?.role === 'admin' || user?.role === 'office';

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            width: '240px',
            marginTop: '64px',
            height: 'calc(100% - 64px)',
            backgroundColor: '#fff',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? '#fff' : undefined
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {canManageClients && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setIsClientsManagerOpen(true)}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Gestione Clienti" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>

      <ClientsManager
        open={isClientsManagerOpen}
        onClose={() => setIsClientsManagerOpen(false)}
        onSave={handleSaveClients}
      />
    </>
  );
};

export default React.memo(Sidebar);
