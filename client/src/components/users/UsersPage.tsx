import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserTable from './UserTable';
import NewUserModal from './NewUserModal';
import UserFilters from './UserFilters';
import { useAuth } from '../../context/AuthContext';

const UsersPage: React.FC = () => {
  const [openNewModal, setOpenNewModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: 'all'
  });
  const { user } = useAuth();

  const handleOpenNewModal = () => {
    setOpenNewModal(true);
  };

  const handleCloseNewModal = () => {
    setOpenNewModal(false);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Gestione Utenti
            </Typography>
            {user?.role === 'admin' && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenNewModal}
              >
                Nuovo Utente
              </Button>
            )}
          </Box>

          <UserFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <Box sx={{ mt: 2 }}>
            <UserTable
              filters={filters}
            />
          </Box>
        </Paper>
      </Box>

      <NewUserModal
        open={openNewModal}
        onClose={handleCloseNewModal}
      />
    </Container>
  );
};

export default UsersPage;
