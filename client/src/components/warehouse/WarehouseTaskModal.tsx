import React, { useState } from 'react';
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
} from '@mui/material';
import { Task, StatusType } from '../../types/task';

interface WarehouseTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
  onSave: (updatedTask: Partial<Task>) => Promise<void>;
}

const WarehouseTaskModal: React.FC<WarehouseTaskModalProps> = ({
  open,
  onClose,
  task,
  onSave
}) => {
  const [status, setStatus] = useState<StatusType>(task?.status || 'pending');
  const [warehouseNotes, setWarehouseNotes] = useState(task?.warehouseNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        status,
        warehouseNotes
      });
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Modifica Task Magazzino</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {/* Campi in sola lettura */}
            <TextField
              label="Cliente"
              value={task?.clients?.join(', ') || ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Tipo Servizio"
              value={task?.serviceType || ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Dati Mezzo"
              value={task?.vehicleData || ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Note Ufficio"
              value={task?.officeNotes || ''}
              InputProps={{ readOnly: true }}
              multiline
              rows={2}
            />

            {/* Campi modificabili */}
            <FormControl>
              <InputLabel>Stato</InputLabel>
              <Select
                value={status}
                label="Stato"
                onChange={(e) => setStatus(e.target.value as StatusType)}
                disabled={isSubmitting}
              >
                <MenuItem value="pending">In attesa</MenuItem>
                <MenuItem value="in_progress">In lavorazione</MenuItem>
                <MenuItem value="completed">Completato</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Note Magazzino"
              value={warehouseNotes}
              onChange={(e) => setWarehouseNotes(e.target.value)}
              multiline
              rows={3}
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Annulla
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Salva
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WarehouseTaskModal;
