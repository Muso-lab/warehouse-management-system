import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { format } from 'date-fns';
import { Task, ServiceType, PriorityType } from '../../types/task';
import { useClients } from '../../context/ClientsContext';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, '_id'> | any) => void;
  selectedDate: Date;
  editTask?: Task | null;
}

const generateTimeOptions = () => {
  const options = [];
  // 0-5 ogni ora
  for (let hour = 0; hour < 5; hour++) {
    options.push(format(new Date().setHours(hour, 0), 'HH:mm'));
  }
  // 5-18 ogni mezz'ora
  for (let hour = 5; hour <= 18; hour++) {
    options.push(format(new Date().setHours(hour, 0), 'HH:mm'));
    options.push(format(new Date().setHours(hour, 30), 'HH:mm'));
  }
  // 19-23 ogni ora
  for (let hour = 19; hour <= 23; hour++) {
    options.push(format(new Date().setHours(hour, 0), 'HH:mm'));
  }
  return options;
};
const NewTaskModal: React.FC<NewTaskModalProps> = ({
  open,
  onClose,
  onSave,
  selectedDate,
  editTask
}) => {
  const { clients } = useClients();
  const timeOptions = generateTimeOptions();

  const [formData, setFormData] = useState({
    serviceType: '',
    vehicleData: '',
    clients: [] as string[],
    priority: '',
    status: 'pending',
    date: format(selectedDate, 'yyyy-MM-dd'),
    startTime: '',
    endTime: '',
    officeNotes: '',
    warehouseNotes: '',
  });

  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTask) {
      setFormData({
        serviceType: editTask.serviceType,
        vehicleData: editTask.vehicleData || '',
        clients: editTask.clients,
        priority: editTask.priority,
        status: editTask.status,
        date: editTask.date,
        startTime: editTask.startTime || '',
        endTime: editTask.endTime || '',
        officeNotes: editTask.officeNotes || '',
        warehouseNotes: editTask.warehouseNotes || '',
      });
    } else {
      setFormData({
        serviceType: '',
        vehicleData: '',
        clients: [],
        priority: '',
        status: 'pending',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: '',
        endTime: '',
        officeNotes: '',
        warehouseNotes: '',
      });
    }
    setTouched(false);
  }, [editTask, selectedDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    console.log('Submitting form data:', formData);

    if (!formData.serviceType || !formData.priority || formData.clients.length === 0) {
      console.log('Validation failed:', {
        serviceType: !formData.serviceType,
        priority: !formData.priority,
        clients: formData.clients.length === 0
      });
      return;
    }

    if (editTask) {
      onSave({ ...formData, _id: editTask._id });
    } else {
      onSave(formData);
    }
  };
  return (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
  >
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>
        {editTask ? 'Modifica Task' : 'Nuovo Task'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo Servizio</InputLabel>
              <Select
                value={formData.serviceType}
                label="Tipo Servizio"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  serviceType: e.target.value as ServiceType
                }))}
                error={touched && !formData.serviceType}
              >
                <MenuItem value="CARICO">Carico</MenuItem>
                <MenuItem value="SCARICO">Scarico</MenuItem>
                <MenuItem value="LOGISTICA">Logistica</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Priorità</InputLabel>
              <Select
                value={formData.priority}
                label="Priorità"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  priority: e.target.value as PriorityType
                }))}
                error={touched && !formData.priority}
              >
                <MenuItem value="EMERGENZA">Emergenza</MenuItem>
                <MenuItem value="AXA">AXA</MenuItem>
                <MenuItem value="AGGIORNAMENTO">Aggiornamento</MenuItem>
                <MenuItem value="ORDINARIO">Ordinario</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={clients || []}
              value={formData.clients}
              onChange={(_, newValue) => {
                console.log('Selected clients:', newValue);
                setFormData(prev => ({
                  ...prev,
                  clients: newValue
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Clienti"
                  required
                  error={touched && formData.clients.length === 0}
                  helperText={touched && formData.clients.length === 0 ? "Seleziona almeno un cliente" : ""}
                  inputProps={{
                    ...params.inputProps,
                    required: false
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Orario Inizio</InputLabel>
              <Select
                value={formData.startTime}
                label="Orario Inizio"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  startTime: e.target.value
                }))}
              >
                {timeOptions.map(time => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Orario Fine</InputLabel>
              <Select
                value={formData.endTime}
                label="Orario Fine"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endTime: e.target.value
                }))}
              >
                {timeOptions.map(time => (
                  <MenuItem key={time} value={time}>{time}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dati Veicolo"
              value={formData.vehicleData}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                vehicleData: e.target.value
              }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Note Ufficio"
              value={formData.officeNotes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                officeNotes: e.target.value
              }))}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Note Magazzino"
              value={formData.warehouseNotes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                warehouseNotes: e.target.value
              }))}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {editTask ? 'Salva Modifiche' : 'Crea Task'}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);
};

export default NewTaskModal;
