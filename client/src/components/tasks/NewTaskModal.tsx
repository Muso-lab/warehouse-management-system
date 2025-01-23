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
  Chip,
  Autocomplete,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Task, SERVICE_TYPE_COLORS, PRIORITY_COLORS } from '../../types/task';
import { useClients } from '../../context/ClientsContext';

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, '_id'>) => Promise<void>;
  selectedDate: Date;
}

const generateTimeOptions = () => {
  const options = [];
  // Dalle 00:00 alle 05:00, solo ore intere
  for (let hour = 0; hour < 6; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  // Dalle 06:00 alle 17:30, ore e mezz'ore
  for (let hour = 6; hour < 18; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    options.push(`${hourStr}:00`);
    options.push(`${hourStr}:30`);
  }
  // Dalle 18:00 alle 23:00, solo ore intere
  for (let hour = 18; hour <= 23; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return options;
};

const timeOptions = generateTimeOptions();

const initialFormState = {
  serviceType: '',
  vehicleData: '',
  clients: [] as string[],
  priority: '',
  status: 'pending' as const,
  date: '',
  startTime: '',
  endTime: '',
  officeNotes: '',
};

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  open,
  onClose,
  onSave,
  selectedDate
}) => {
  const { clients } = useClients();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('NewTaskModal rendered with props:', {
    open,
    selectedDate,
    clients,
    formData
  });

  useEffect(() => {
    if (open) {
      console.log('Modal opened, clients available:', clients);
      console.log('Selected date:', selectedDate);

      setFormData({
        ...initialFormState,
        date: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  }, [open, selectedDate]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    console.log(`Changing ${field}:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    const isValid =
      formData.serviceType !== '' &&
      formData.priority !== '' &&
      Array.isArray(formData.clients) &&
      formData.clients.length > 0;

    console.log('Form validation:', {
      serviceType: formData.serviceType,
      priority: formData.priority,
      clients: formData.clients,
      isValid
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');

    if (!isFormValid()) {
      console.log('Form validation failed:', {
        serviceType: formData.serviceType,
        priority: formData.priority,
        clients: formData.clients,
        hasClients: formData.clients.length > 0
      });
      return;
    }

    console.log('Form is valid, proceeding with save');
    setIsSubmitting(true);

    try {
      const taskData = {
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: 'pending' as const,
      };

      console.log('Task data to save:', taskData);
      await onSave(taskData);
      console.log('Task saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { overflowY: 'visible' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Nuovo Task</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
          </Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={(e) => {
        console.log('Form submit triggered');
        handleSubmit(e);
      }}>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <FormControl required>
              <InputLabel>Tipo Servizio</InputLabel>
              <Select
                value={formData.serviceType}
                label="Tipo Servizio *"
                onChange={(e) => handleChange('serviceType', e.target.value)}
                renderValue={(selected) => (
                  <Chip
                    label={selected}
                    color={SERVICE_TYPE_COLORS[selected as keyof typeof SERVICE_TYPE_COLORS]}
                    size="small"
                  />
                )}
              >
                {Object.keys(SERVICE_TYPE_COLORS).map((type) => (
                  <MenuItem key={type} value={type}>
                    <Chip
                      label={type}
                      color={SERVICE_TYPE_COLORS[type as keyof typeof SERVICE_TYPE_COLORS]}
                      size="small"
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Dati Mezzo"
              value={formData.vehicleData}
              onChange={(e) => handleChange('vehicleData', e.target.value)}
            />

            <Autocomplete
              multiple
              options={clients || []}
              value={formData.clients}
              onChange={(_, newValue) => {
                console.log('Selected clients:', newValue);
                handleChange('clients', newValue || []);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Clienti *"
                  required
                  error={formData.clients.length === 0}
                  helperText={formData.clients.length === 0 ? "Seleziona almeno un cliente" : ""}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option === value}
            />

            <FormControl required>
              <InputLabel>Priorità</InputLabel>
              <Select
                value={formData.priority}
                label="Priorità *"
                onChange={(e) => handleChange('priority', e.target.value)}
                renderValue={(selected) => (
                  <Chip
                    label={selected}
                    color={PRIORITY_COLORS[selected as keyof typeof PRIORITY_COLORS]}
                    size="small"
                  />
                )}
              >
                {Object.keys(PRIORITY_COLORS).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <Chip
                      label={priority}
                      color={PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]}
                      size="small"
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Orario Inizio</InputLabel>
              <Select
                value={formData.startTime}
                label="Orario Inizio"
                onChange={(e) => handleChange('startTime', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    },
                  },
                }}
              >
                <MenuItem value="">-</MenuItem>
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel>Orario Fine</InputLabel>
              <Select
                value={formData.endTime}
                label="Orario Fine"
                onChange={(e) => handleChange('endTime', e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    },
                  },
                }}
              >
                <MenuItem value="">-</MenuItem>
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Note Ufficio"
              multiline
              rows={3}
              value={formData.officeNotes}
              onChange={(e) => handleChange('officeNotes', e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Annulla
          </Button>
          <Button
            type="button"
            variant="contained"
            disabled={isSubmitting || !isFormValid()}
            onClick={(e) => {
              console.log('Save button clicked');
              handleSubmit(e);
            }}
          >
            Salva
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewTaskModal;
