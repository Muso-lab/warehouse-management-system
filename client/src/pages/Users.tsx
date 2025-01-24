import { Box, Paper, Button, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
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
        const updatedUser = await userService.updateUser(editingUser._id!, userData);
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
      } else {
        const newUser = await userService.createUser(userData);
        setUsers(prevUsers => [newUser, ...prevUsers]);
      }

      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError('Errore nel salvataggio dell\'utente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await userService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      setError('Errore nell\'eliminazione dell\'utente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Utenti">
      <Box sx={{ mb: 3 }}>
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

      <Paper sx={{ width: '100%', position: 'relative' }}>
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
          onEditUser={setEditingUser}
        />
      </Paper>

      <NewUserModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editUser={editingUser}
      />
    </PageContainer>
  );
};

export default Users;
