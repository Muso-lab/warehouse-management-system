import { Box, Paper, Button, Alert, CircularProgress, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import ClientTable from '../components/clients/ClientTable';
import { clientService } from '../services/clientService';
import { useClients } from '../context/ClientsContext';

const Clients = () => {
  const { updateClients } = useClients();
  const [localClients, setLocalClients] = useState<string[]>([]);
  const [newClient, setNewClient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedClients = await clientService.getAllClients();
      setLocalClients(loadedClients);
      updateClients(loadedClients);
    } catch (err) {
      setError('Errore nel caricamento dei clienti');
      console.error('Error loading clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (newClient.trim() && !localClients.includes(newClient.trim())) {
      try {
        setIsLoading(true);
        setError(null);
        await clientService.addClient(newClient.trim());
        await loadClients();
        setNewClient('');
      } catch (err) {
        setError('Errore durante l\'aggiunta del cliente');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteClient = async (clientToDelete: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await clientService.deleteClient(clientToDelete);
      await loadClients();
    } catch (err) {
      setError('Errore durante l\'eliminazione del cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Gestione Clienti">
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Nuovo Cliente"
          value={newClient}
          onChange={(e) => setNewClient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddClient()}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClient}
          disabled={isLoading || !newClient.trim()}
        >
          Aggiungi Cliente
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
        <ClientTable
          clients={localClients}
          onDeleteClient={handleDeleteClient}
        />
      </Paper>
    </PageContainer>
  );
};

export default Clients;
