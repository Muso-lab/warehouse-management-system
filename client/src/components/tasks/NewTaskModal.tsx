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
  Chip,
  FormHelperText
} from '@mui/material';
import { useState } from 'react';
import { ServiceType, PriorityType } from '../../types/task';
import { useClients } from '../../context/ClientsContext';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
}

interface FormErrors {
  serviceType?: string;
  date?: string;
  clients?: string;
  priority?: string;
}

const NewTaskModal = ({ open, onClose, onSave }: NewTaskModalProps) => {
  const { clients: availableClients } = useClients();

  const initialTaskData = {
    serviceType: '' as ServiceType,
    vehicleData: '',
    clients: [] as string[],
    priority: '' as PriorityType,
    date: '',
    startTime: '',
    endTime: '',
    officeNotes: '',
    warehouseNotes: ''
  };

  const [taskData, setTaskData] = useState(initialTaskData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!taskData.serviceType) {
      newErrors.serviceType = 'Tipo servizio è obbligatorio';
    }
    if (!taskData.date) {
      newErrors.date = 'Data è obbligatoria';
    }
    if (!taskData.clients || taskData.clients.length === 0) {
      newErrors.clients = 'Seleziona almeno un cliente';
    }
    if (!taskData.priority) {
      newErrors.priority = 'Priorità è obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(taskData);
      setTaskData(initialTaskData);
      onClose();
    }
  };

  const handleClose = () => {
    setTaskData(initialTaskData);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuovo Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="date"
              label="Data"
              required
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              value={taskData.date}
              onChange={(e) => setTaskData({ ...taskData, date: e.target.value })}
            />

            <FormControl required error={!!errors.serviceType}>
              <InputLabel>Tipo Servizio</InputLabel>
              <Select
                value={taskData.serviceType}
                label="Tipo Servizio"
                onChange={(e) => setTaskData({ ...taskData, serviceType: e.target.value as ServiceType })}
              >
                <MenuItem value="CARICO">CARICO</MenuItem>
                <MenuItem value="SCARICO">SCARICO</MenuItem>
                <MenuItem value="LOGISTICA">LOGISTICA</MenuItem>
              </Select>
              {errors.serviceType && <FormHelperText>{errors.serviceType}</FormHelperText>}
            </FormControl>

            <TextField
              label="Dati Mezzo"
              multiline
              rows={2}
              value={taskData.vehicleData}
              onChange={(e) => setTaskData({ ...taskData, vehicleData: e.target.value })}
            />

            <Autocomplete
              multiple
              options={availableClients}
              value={taskData.clients}
              onChange={(_, newValue) => {
                setTaskData({ ...taskData, clients: newValue });
                if (errors.clients && newValue.length > 0) {
                  setErrors({ ...errors, clients: undefined });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Clienti"
                  required
                  error={!!errors.clients}
                  helperText={errors.clients}
                  InputProps={{
                    ...params.InputProps,
                    required: false
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />

            <FormControl required error={!!errors.priority}>
              <InputLabel>Priorità</InputLabel>
              <Select
                value={taskData.priority}
                label="Priorità"
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as PriorityType })}
              >
                <MenuItem value="EMERGENZA">EMERGENZA</MenuItem>
                <MenuItem value="AXA">AXA</MenuItem>
                <MenuItem value="AGGIORNAMENTO">AGGIORNAMENTO</MenuItem>
                <MenuItem value="ORDINARIO">ORDINARIO</MenuItem>
              </Select>
              {errors.priority && <FormHelperText>{errors.priority}</FormHelperText>}
            </FormControl>

            <TextField
              type="time"
              label="Orario Inizio"
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 1800 }}
              value={taskData.startTime}
              onChange={(e) => setTaskData({ ...taskData, startTime: e.target.value })}
            />

            <TextField
              type="time"
              label="Orario Fine"
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 1800 }}
              value={taskData.endTime}
              onChange={(e) => setTaskData({ ...taskData, endTime: e.target.value })}
            />

            <TextField
              label="Note Ufficio"
              multiline
              rows={2}
              value={taskData.officeNotes}
              onChange={(e) => setTaskData({ ...taskData, officeNotes: e.target.value })}
            />

            <TextField
              label="Note Magazzino"
              multiline
              rows={2}
              value={taskData.warehouseNotes}
              onChange={(e) => setTaskData({ ...taskData, warehouseNotes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button type="submit" variant="contained">Salva</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewTaskModal;
