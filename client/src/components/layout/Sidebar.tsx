import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
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

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    text: 'Task',
    icon: <TasksIcon />,
    path: '/tasks'
  },
  {
    text: 'Utenti',
    icon: <UsersIcon />,
    path: '/users'
  }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClientsManagerOpen, setIsClientsManagerOpen] = React.useState(false);
  const { clients, updateClients } = useClients();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSaveClients = (newClients: string[]) => {
    updateClients(newClients);
    console.log('Clienti aggiornati:', newClients);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 8 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
              >
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setIsClientsManagerOpen(true)}
                selected={isClientsManagerOpen}
              >
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Gestione Clienti" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <ClientsManager
        open={isClientsManagerOpen}
        onClose={() => setIsClientsManagerOpen(false)}
      />
    </>
  );
};

export default React.memo(Sidebar);
