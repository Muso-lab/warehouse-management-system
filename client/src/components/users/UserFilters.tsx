import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';

interface UserFiltersProps {
  filters: {
    search: string;
    role: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange }) => {
  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
            label="Cerca utente"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={handleChange('search')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Ruolo"
            variant="outlined"
            size="small"
            value={filters.role}
            onChange={handleChange('role')}
          >
            <MenuItem value="">Tutti</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="office">Ufficio</MenuItem>
            <MenuItem value="warehouse">Magazzino</MenuItem>
            <MenuItem value="monitor">Monitor</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Stato"
            variant="outlined"
            size="small"
            value={filters.status}
            onChange={handleChange('status')}
          >
            <MenuItem value="all">Tutti</MenuItem>
            <MenuItem value="active">Attivi</MenuItem>
            <MenuItem value="inactive">Inattivi</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserFilters;
