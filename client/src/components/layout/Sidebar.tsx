import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TasksIcon,
  Settings as SettingsIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import ClientsManager from '../settings/ClientsManager';
import { useClients } from '../../context/ClientsContext';

const drawerWidth = 240;

const Sidebar = () => {
  const [isClientsManagerOpen, setIsClientsManagerOpen] = useState(false);
  const { clients, updateClients } = useClients();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Task', icon: <TasksIcon /> },
    { text: 'Utenti', icon: <UsersIcon /> },
  ];

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
              <ListItem button key={item.text}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={() => setIsClientsManagerOpen(true)}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Gestione Clienti" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <ClientsManager
        open={isClientsManagerOpen}
        onClose={() => setIsClientsManagerOpen(false)}
        initialClients={clients}
        onSave={handleSaveClients}
      />
    </>
  );
};

export default Sidebar;
