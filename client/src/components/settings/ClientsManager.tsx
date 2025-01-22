import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';
import { useClients } from '../../context/ClientsContext';

interface ClientsManagerProps {
  open: boolean;
  onClose: () => void;
}

const ClientsManager = ({ open, onClose }: ClientsManagerProps) => {
  const { clients, updateClients } = useClients();
  const [localClients, setLocalClients] = useState<string[]>([]);
  const [newClient, setNewClient] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const loadedClients = await clientService.getAllClients();
      setLocalClients(loadedClients);
      updateClients(loadedClients);
    } catch (err) {
      setError('Errore nel caricamento dei clienti');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    if (newClient.trim() && !localClients.includes(newClient.trim())) {
      try {
        setLoading(true);
        setError(null);
        await clientService.addClient(newClient.trim());
        await loadClients(); // Ricarica la lista completa
        setNewClient('');
      } catch (err) {
        setError('Errore durante l\'aggiunta del cliente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClient = async (clientToDelete: string) => {
    try {
      setLoading(true);
      setError(null);
      await clientService.deleteClient(clientToDelete);
      await loadClients(); // Ricarica la lista completa
    } catch (err) {
      setError('Errore durante l\'eliminazione del cliente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setNewClient('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Gestione Clienti</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mb: 2, mt: 1, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="Nuovo Cliente"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddClient()}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleAddClient}
            startIcon={<AddIcon />}
            disabled={loading}
          >
            Aggiungi
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {localClients.map((client) => (
              <ListItem key={client}>
                <ListItemText primary={client} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClient(client)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientsManager;
