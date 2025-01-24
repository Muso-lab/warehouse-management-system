import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

interface TaskFiltersProps {
  onFilterChange: (filters: any) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    client: ''
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      [field]: event.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Cerca"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={handleChange('search')}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Stato</InputLabel>
            <Select
              value={filters.status}
              label="Stato"
              onChange={handleChange('status')}
            >
              <MenuItem value="">Tutti</MenuItem>
              <MenuItem value="pending">In attesa</MenuItem>
              <MenuItem value="in_progress">In corso</MenuItem>
              <MenuItem value="completed">Completato</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Priorità</InputLabel>
            <Select
              value={filters.priority}
              label="Priorità"
              onChange={handleChange('priority')}
            >
              <MenuItem value="">Tutte</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
              <MenuItem value="medium">Media</MenuItem>
              <MenuItem value="low">Bassa</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={filters.client}
              label="Cliente"
              onChange={handleChange('client')}
            >
              <MenuItem value="">Tutti</MenuItem>
              {/* I clienti verranno popolati dinamicamente */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskFilters;
