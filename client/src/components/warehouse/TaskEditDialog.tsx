// client/src/components/warehouse/TaskEditDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Task } from '../../types/task';

interface TaskEditDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<Task>) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  task,
  onClose,
  onSave,
}) => {
  const [editedValues, setEditedValues] = useState({
    status: task?.status || '',
    warehouseNotes: task?.warehouseNotes || ''
  });

  const handleSave = () => {
    if (task) {
      onSave(task._id!, editedValues);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{
        textTransform: 'uppercase',
        fontWeight: 700,
        backgroundColor: theme => theme.palette.primary.main,
        color: 'white'
      }}>
        MODIFICA TASK
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <Select
              value={editedValues.status}
              onChange={(e) => setEditedValues(prev => ({
                ...prev,
                status: e.target.value as string
              }))}
            >
              <MenuItem value="pending">IN ATTESA</MenuItem>
              <MenuItem value="in_progress">IN CORSO</MenuItem>
              <MenuItem value="completed">COMPLETATO</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="NOTE MAGAZZINO"
            value={editedValues.warehouseNotes}
            onChange={(e) => setEditedValues(prev => ({
              ...prev,
              warehouseNotes: e.target.value
            }))}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          ANNULLA
        </Button>
        <Button onClick={handleSave} variant="contained">
          SALVA
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog;
