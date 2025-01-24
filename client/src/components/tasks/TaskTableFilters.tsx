import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';

interface TaskTableFiltersProps {
  filters: {
    serviceType: string;
    priority: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
}

const TaskTableFilters: React.FC<TaskTableFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            size="small"
            label="Tipo Servizio"
            value={filters.serviceType}
            onChange={handleFilterChange('serviceType')}
          >
            <MenuItem value="">Tutti</MenuItem>
            <MenuItem value="CARICO">Carico</MenuItem>
            <MenuItem value="SCARICO">Scarico</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            size="small"
            label="Priorità"
            value={filters.priority}
            onChange={handleFilterChange('priority')}
          >
            <MenuItem value="">Tutte</MenuItem>
            <MenuItem value="EMERGENZA">Emergenza</MenuItem>
            <MenuItem value="AXA">AXA</MenuItem>
            <MenuItem value="AGGIORNAMENTO">Aggiornamento</MenuItem>
            <MenuItem value="ORDINARIO">Ordinario</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            size="small"
            label="Stato"
            value={filters.status}
            onChange={handleFilterChange('status')}
          >
            <MenuItem value="">Tutti</MenuItem>
            <MenuItem value="pending">In Attesa</MenuItem>
            <MenuItem value="in_progress">In Corso</MenuItem>
            <MenuItem value="completed">Completato</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskTableFilters;
