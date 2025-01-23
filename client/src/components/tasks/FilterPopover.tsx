import {
  Popover,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  OutlinedInput,
  Chip
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { FilterState } from '../../hooks/useTaskTable';
import { SERVICE_TYPE_COLORS, PRIORITY_COLORS } from '../../types/task';

interface FilterPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  currentFilterColumn: string;
  filters: FilterState;
  onFilterChange: (column: keyof FilterState, value: any) => void;
  onClearFilter: (column: keyof FilterState) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  currentFilterColumn,
  filters,
  onFilterChange,
  onClearFilter
}) => {
  const renderFilterContent = () => {
    const column = currentFilterColumn as keyof FilterState;

    switch (column) {
      case 'serviceType':
        return (
          <FormControl fullWidth>
            <InputLabel>Tipo Servizio</InputLabel>
            <Select
              multiple
              value={filters.serviceType}
              onChange={(e) => onFilterChange(column, e.target.value)}
              input={<OutlinedInput label="Tipo Servizio" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      color={SERVICE_TYPE_COLORS[value]}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {['CARICO', 'SCARICO', 'LOGISTICA'].map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={filters.serviceType.includes(type)} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      // ... altri casi simili per priority e status ...

      default:
        return (
          <TextField
            fullWidth
            label={`Filtra per ${currentFilterColumn}`}
            value={filters[column]}
            onChange={(e) => onFilterChange(column, e.target.value)}
          />
        );
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2, minWidth: 250 }}>
        {renderFilterContent()}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={() => onClearFilter(currentFilterColumn as keyof FilterState)}
          >
            Pulisci
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={onClose}
          >
            Applica
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default FilterPopover;
