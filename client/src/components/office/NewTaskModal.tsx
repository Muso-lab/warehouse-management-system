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
import { useState } from 'react';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
}

const NewTaskModal = ({ open, onClose, onSubmit }: NewTaskModalProps) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'normal',
    assignedTo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    setTask({
      title: '',
      description: '',
      priority: 'normal',
      assignedTo: '',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nuovo Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Titolo"
              fullWidth
              required
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
            <TextField
              label="Descrizione"
              fullWidth
              multiline
              rows={4}
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priorità</InputLabel>
              <Select
                value={task.priority}
                label="Priorità"
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
              >
                <MenuItem value="low">Bassa</MenuItem>
                <MenuItem value="normal">Normale</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Assegna a"
              fullWidth
              required
              value={task.assignedTo}
              onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annulla</Button>
          <Button type="submit" variant="contained">Crea</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewTaskModal;
