import { Box, Paper, Typography, Button, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import UserTable from '../components/users/UserTable';
import NewUserModal from '../components/users/NewUserModal';
import { User } from '../types/user';
import { userService } from '../services/userService';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedUsers = await userService.getAllUsers();
      setUsers(loadedUsers);
    } catch (err) {
      setError('Errore nel caricamento degli utenti');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUser = async (userData: User) => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingUser) {
        // Update esistente
        const updatedUser = await userService.updateUser(editingUser._id!, {
          username: userData.username,
          role: userData.role,
          active: userData.active,
          ...(userData.password ? { password: userData.password } : {})
        });
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
      } else {
        // Nuovo utente
        const newUser = await userService.createUser(userData);
        setUsers(prevUsers => [newUser, ...prevUsers]);
      }

      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError(editingUser
        ? 'Errore nell\'aggiornamento dell\'utente'
        : 'Errore nel salvataggio dell\'utente'
      );
      console.error('Error saving/updating user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await userService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      setError('Errore nell\'eliminazione dell\'utente');
      console.error('Error deleting user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4">Gestione Utenti</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
          >
            Nuovo Utente
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%', mb: 2, position: 'relative' }}>
          {isLoading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}
          <UserTable
            users={users}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
          />
        </Paper>

        <NewUserModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          editUser={editingUser}
        />
      </Box>
    </Box>
  );
};

export default Users;
