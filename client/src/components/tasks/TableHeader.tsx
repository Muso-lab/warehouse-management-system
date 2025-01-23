import {
  TableHead,
  TableRow,
  TableCell,
  Box,
  IconButton
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { Task } from '../../types/task';
import { SortConfig, FilterState } from '../../hooks/useTaskTable';

interface TableHeaderProps {
  onSort: (key: keyof Task) => void;
  onFilterClick: (event: React.MouseEvent<HTMLElement>, key: string) => void;
  sortConfig: SortConfig;
  filters: FilterState;
  tableHeaderStyle: Record<string, any>;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  onSort,
  onFilterClick,
  sortConfig,
  filters,
  tableHeaderStyle
}) => {
  const headers = [
    { label: 'Tipo Servizio', key: 'serviceType' },
    { label: 'Dati Mezzo', key: 'vehicleData' },
    { label: 'Cliente', key: 'clients' },
    { label: 'Priorità', key: 'priority' },
    { label: 'Stato', key: 'status' },
    { label: 'Orario Inizio', key: 'startTime' },
    { label: 'Orario Fine', key: 'endTime' },
    { label: 'Note Ufficio', key: 'officeNotes' },
    { label: 'Note Magazzino', key: 'warehouseNotes' },
    { label: 'Azioni', key: '' }
  ];

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
        {headers.map(({ label, key }) => (
          <TableCell
            key={label}
            sx={{
              ...tableHeaderStyle,
              cursor: key ? 'pointer' : 'default',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                onClick={() => key && onSort(key as keyof Task)}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {label}
                {key && sortConfig.key === key && sortConfig.direction && (
                  sortConfig.direction === 'asc' ?
                    <ArrowUpwardIcon fontSize="small" /> :
                    <ArrowDownwardIcon fontSize="small" />
                )}
              </Box>
              {key && (
                <IconButton
                  size="small"
                  onClick={(e) => onFilterClick(e, key)}
                  color={
                    filters[key as keyof FilterState]?.length > 0 ||
                    filters[key as keyof FilterState] !== ''
                      ? 'primary'
                      : 'default'
                  }
                >
                  <FilterListIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
