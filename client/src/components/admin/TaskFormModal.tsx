// src/components/admin/TaskFormModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Task } from '../../types/task';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  task?: Task | null;
  mode: 'create' | 'edit';
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  task,
  mode
}) => {
  // Implementazione del form modale
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Nuovo Task' : 'Modifica Task'}
      </DialogTitle>
      <DialogContent>
        {/* Form fields */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={() => onSubmit(task!)}>Salva</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;
