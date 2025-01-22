import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  CircularProgress,
  Alert
} from '@mui/material';
import { Task } from '../../types/task';
import { useClients } from '../../context/ClientsContext';

interface EditTaskModalProps {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Partial<Task>) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  task,
  onClose,
  onSave
}) => {
  const { clients } = useClients();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    serviceType: task.serviceType,
    priority: task.priority,
    status: task.status,
    clients: task.clients,
    vehicleData: task.vehicleData || '',
    startTime: task.startTime || '',
    endTime: task.endTime || '',
    officeNotes: task.officeNotes || '',
    warehouseNotes: task.warehouseNotes || '',
    date: task.date
  });

  useEffect(() => {
    setFormData({
      serviceType: task.serviceType,
      priority: task.priority,
      status: task.status,
      clients: task.clients,
      vehicleData: task.vehicleData || '',
      startTime: task.startTime || '',
      endTime: task.endTime || '',
      officeNotes: task.officeNotes || '',
      warehouseNotes: task.warehouseNotes || '',
      date: task.date
    });
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError('Errore durante il salvataggio delle modifiche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Modifica Task</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo Servizio</InputLabel>
              <Select
                value={formData.serviceType}
                label="Tipo Servizio"
                onChange={(e) => handleChange('serviceType', e.target.value)}
                disabled={isLoading}
              >
                <MenuItem value="CARICO">Carico</MenuItem>
                <MenuItem value="SCARICO">Scarico</MenuItem>
                <MenuItem value="LOGISTICA">Logistica</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priorità</InputLabel>
              <Select
                value={formData.priority}
                label="Priorità"
                onChange={(e) => handleChange('priority', e.target.value)}
                disabled={isLoading}
              >
                <MenuItem value="EMERGENZA">Emergenza</MenuItem>
                <MenuItem value="AXA">AXA</MenuItem>
                <MenuItem value="AGGIORNAMENTO">Aggiornamento</MenuItem>
                <MenuItem value="ORDINARIO">Ordinario</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Stato</InputLabel>
              <Select
                value={formData.status}
                label="Stato"
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={isLoading}
              >
                <MenuItem value="pending">In Attesa</MenuItem>
                <MenuItem value="in_progress">In Corso</MenuItem>
                <MenuItem value="completed">Completato</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={clients}
              value={formData.clients}
              onChange={(_, newValue) => handleChange('clients', newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Clienti" />
              )}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Dati Mezzo"
              value={formData.vehicleData}
              onChange={(e) => handleChange('vehicleData', e.target.value)}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              type="time"
              label="Orario Inizio"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              type="time"
              label="Orario Fine"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Note Ufficio"
              value={formData.officeNotes}
              onChange={(e) => handleChange('officeNotes', e.target.value)}
              multiline
              rows={2}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Note Magazzino"
              value={formData.warehouseNotes}
              onChange={(e) => handleChange('warehouseNotes', e.target.value)}
              multiline
              rows={2}
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Annulla
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Salva Modifiche'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTaskModal;
