import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  TableSortLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Task } from '../../types/task';

interface TaskTableProps {
  tasks: Task[];
  loading?: boolean;
  onUpdateTask?: (taskId: string, task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

type SortOrder = 'asc' | 'desc';
type SortField = 'serviceType' | 'clients' | 'priority' | 'status' | 'startTime' | 'endTime';

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading = false,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [filters, setFilters] = useState({
    serviceType: '',
    priority: '',
    status: ''
  });
  const [sortField, setSortField] = useState<SortField>('startTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Gestione filtri
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestione ordinamento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtraggio e ordinamento dei task
  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filters.serviceType && task.serviceType !== filters.serviceType) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.status && task.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => {
      const compareValue = (aVal: any, bVal: any) => {
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      };

      switch (sortField) {
        case 'serviceType':
          return compareValue(a.serviceType, b.serviceType);
        case 'clients':
          return compareValue(a.clients[0], b.clients[0]);
        case 'priority':
          return compareValue(a.priority, b.priority);
        case 'status':
          return compareValue(a.status, b.status);
        case 'startTime':
          return compareValue(a.startTime || '', b.startTime || '');
        case 'endTime':
          return compareValue(a.endTime || '', b.endTime || '');
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completato';
      case 'in_progress': return 'In Corso';
      default: return 'In Attesa';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'EMERGENZA': return 'error';
      case 'AXA': return 'warning';
      case 'AGGIORNAMENTO': return 'info';
      default: return 'default';
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'CARICO': return 'primary';
      case 'SCARICO': return 'warning';
      default: return 'default';
    }
  };

  const TableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TableSortLabel
              active={sortField === 'serviceType'}
              direction={sortField === 'serviceType' ? sortOrder : 'asc'}
              onClick={() => handleSort('serviceType')}
            >
              Tipo Servizio
            </TableSortLabel>
            <FormControl size="small" fullWidth>
              <Select
                value={filters.serviceType}
                onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                displayEmpty
                sx={{ height: '32px' }}
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="CARICO">Carico</MenuItem>
                <MenuItem value="SCARICO">Scarico</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === 'clients'}
            direction={sortField === 'clients' ? sortOrder : 'asc'}
            onClick={() => handleSort('clients')}
          >
            Cliente
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TableSortLabel
              active={sortField === 'priority'}
              direction={sortField === 'priority' ? sortOrder : 'asc'}
              onClick={() => handleSort('priority')}
            >
              Priorità
            </TableSortLabel>
            <FormControl size="small" fullWidth>
              <Select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                displayEmpty
                sx={{ height: '32px' }}
              >
                <MenuItem value="">Tutte</MenuItem>
                <MenuItem value="EMERGENZA">Emergenza</MenuItem>
                <MenuItem value="AXA">AXA</MenuItem>
                <MenuItem value="AGGIORNAMENTO">Aggiornamento</MenuItem>
                <MenuItem value="ORDINARIO">Ordinario</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TableSortLabel
              active={sortField === 'status'}
              direction={sortField === 'status' ? sortOrder : 'asc'}
              onClick={() => handleSort('status')}
            >
              Stato
            </TableSortLabel>
            <FormControl size="small" fullWidth>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                displayEmpty
                sx={{ height: '32px' }}
              >
                <MenuItem value="">Tutti</MenuItem>
                <MenuItem value="pending">In Attesa</MenuItem>
                <MenuItem value="in_progress">In Corso</MenuItem>
                <MenuItem value="completed">Completato</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === 'startTime'}
            direction={sortField === 'startTime' ? sortOrder : 'asc'}
            onClick={() => handleSort('startTime')}
          >
            Orario Inizio
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={sortField === 'endTime'}
            direction={sortField === 'endTime' ? sortOrder : 'asc'}
            onClick={() => handleSort('endTime')}
          >
            Orario Fine
          </TableSortLabel>
        </TableCell>
        <TableCell>Note Ufficio</TableCell>
        <TableCell>Note Magazzino</TableCell>
        <TableCell align="right">Azioni</TableCell>
      </TableRow>
    </TableHead>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHeader />
          <TableBody>
            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>
                    <Chip
                      label={task.serviceType}
                      color={getServiceTypeColor(task.serviceType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{task.clients.join(', ')}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(task.status)}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{task.startTime || '-'}</TableCell>
                  <TableCell>{task.endTime || '-'}</TableCell>
                  <TableCell>{task.officeNotes || '-'}</TableCell>
                  <TableCell>{task.warehouseNotes || '-'}</TableCell>
                  <TableCell align="right">
                    {onUpdateTask && (
                      <IconButton
                        size="small"
                        onClick={() => onUpdateTask(task._id!, task)}
                        title="Modifica"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDeleteTask && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (window.confirm('Sei sicuro di voler eliminare questo task?')) {
                            onDeleteTask(task._id!);
                          }
                        }}
                        color="error"
                        title="Elimina"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Nessun task per questa data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TaskTable;
