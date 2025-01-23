import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Autocomplete
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ServiceType, PriorityType, StatusType } from '../../types/task';
import { useClients } from '../../context/ClientsContext';

interface FilterValues {
  serviceType: ServiceType | '';
  priority: PriorityType | '';
  status: StatusType | '';
  client: string;
  vehicleData: string;
}

interface TaskFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

const TaskFilters = ({ filters, onFilterChange, onClearFilters }: TaskFiltersProps) => {
  const { clients } = useClients();

  const handleChange = (field: keyof FilterValues, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      mb: 3,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Tipo Servizio</InputLabel>
        <Select
          value={filters.serviceType}
          label="Tipo Servizio"
          onChange={(e) => handleChange('serviceType', e.target.value)}
        >
          <MenuItem value="">Tutti</MenuItem>
          <MenuItem value="CARICO">CARICO</MenuItem>
          <MenuItem value="SCARICO">SCARICO</MenuItem>
          <MenuItem value="LOGISTICA">LOGISTICA</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Priorità</InputLabel>
        <Select
          value={filters.priority}
          label="Priorità"
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <MenuItem value="">Tutte</MenuItem>
          <MenuItem value="EMERGENZA">EMERGENZA</MenuItem>
          <MenuItem value="AXA">AXA</MenuItem>
          <MenuItem value="AGGIORNAMENTO">AGGIORNAMENTO</MenuItem>
          <MenuItem value="ORDINARIO">ORDINARIO</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Stato</InputLabel>
        <Select
          value={filters.status}
          label="Stato"
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <MenuItem value="">Tutti</MenuItem>
          <MenuItem value="pending">In attesa</MenuItem>
          <MenuItem value="in_progress">In corso</MenuItem>
          <MenuItem value="completed">Completato</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        size="small"
        options={clients}
        value={filters.client}
        onChange={(_, newValue) => handleChange('client', newValue || '')}
        sx={{ minWidth: 200 }}
        renderInput={(params) => (
          <TextField {...params} label="Cliente" />
        )}
      />

      <TextField
        size="small"
        label="Dati Mezzo"
        value={filters.vehicleData}
        onChange={(e) => handleChange('vehicleData', e.target.value)}
        sx={{ minWidth: 150 }}
      />

      <IconButton
        onClick={onClearFilters}
        color="primary"
        size="small"
      >
        <ClearIcon />
      </IconButton>
    </Box>
  );
};

export default TaskFilters;
