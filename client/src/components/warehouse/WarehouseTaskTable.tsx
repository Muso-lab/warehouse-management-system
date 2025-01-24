// client/src/components/warehouse/WarehouseTaskTable.tsx
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Popover,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { Task } from '../../types/task';
import { tableStyles } from '../../styles/tableStyles';

interface WarehouseTaskTableProps {
  tasks: Task[];
  loading?: boolean;
  onUpdateTask: (taskId: string, updates: { status: string; warehouseNotes: string }) => void;
}

type SortOrder = 'asc' | 'desc';
type SortField = 'serviceType' | 'clients' | 'priority' | 'status' | 'startTime' | 'endTime';

interface ColumnHeaderProps {
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  sortActive?: boolean;
  sortDirection?: 'asc' | 'desc';
  onSort?: () => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: { value: string; label: string; color?: string }[];
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  label,
  sortable = false,
  filterable = false,
  sortActive = false,
  sortDirection = 'asc',
  onSort,
  filterValue = '',
  onFilterChange,
  filterOptions = []
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      py: 1
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}>
        {sortable ? (
          <TableSortLabel
            active={sortActive}
            direction={sortDirection}
            onClick={onSort}
            sx={{
              textTransform: 'uppercase',
              fontWeight: 700,
              '& .MuiTableSortLabel-icon': {
                opacity: sortActive ? 1 : 0.5
              }
            }}
          >
            {label}
          </TableSortLabel>
        ) : (
          <Typography sx={{
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
            {label}
          </Typography>
        )}

        {filterable && (
          <Tooltip title="Filtro">
            <IconButton
              size="small"
              onClick={handleFilterClick}
              sx={{
                ml: 0.5,
                opacity: filterValue ? 1 : 0.5,
                '&:hover': { opacity: 1 }
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {filterable && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              boxShadow: 2,
              maxHeight: '300px'
            }
          }}
        >
          <Box sx={{ p: 1, minWidth: '150px' }}>
            <MenuItem
              onClick={() => {
                onFilterChange?.('');
                handleClose();
              }}
              selected={filterValue === ''}
            >
              <Typography sx={{ textAlign: 'center', width: '100%' }}>
                TUTTI
              </Typography>
            </MenuItem>
            {filterOptions.map(option => (
              <MenuItem
                key={option.value}
                onClick={() => {
                  onFilterChange?.(option.value);
                  handleClose();
                }}
                selected={filterValue === option.value}
                sx={{ justifyContent: 'center' }}
              >
                <Chip
                  label={option.label}
                  color={option.color as any || 'default'}
                  size="small"
                  sx={tableStyles.chip}
                />
              </MenuItem>
            ))}
          </Box>
        </Popover>
      )}
    </Box>
  );
};
const WarehouseTaskTable: React.FC<WarehouseTaskTableProps> = ({
  tasks,
  loading = false,
  onUpdateTask,
}) => {
  const [filters, setFilters] = useState({
    serviceType: '',
    priority: '',
    status: ''
  });
  const [sortField, setSortField] = useState<SortField>('startTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedValues, setEditedValues] = useState({
    status: '',
    warehouseNotes: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'COMPLETATO';
      case 'in_progress': return 'IN CORSO';
      default: return 'IN ATTESA';
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
      case 'DEPOSITO': return 'info';
      default: return 'default';
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditedValues({
      status: task.status,
      warehouseNotes: task.warehouseNotes || ''
    });
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setEditingTask(null);
  };

  const handleEditSave = async () => {
    if (editingTask) {
      try {
        await onUpdateTask(editingTask._id!, editedValues);
        handleEditClose();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

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
        case 'serviceType': return compareValue(a.serviceType, b.serviceType);
        case 'clients': return compareValue(a.clients[0], b.clients[0]);
        case 'priority': return compareValue(a.priority, b.priority);
        case 'status': return compareValue(a.status, b.status);
        case 'startTime': return compareValue(a.startTime || '', b.startTime || '');
        case 'endTime': return compareValue(a.endTime || '', b.endTime || '');
        default: return 0;
      }
    });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={tableStyles.tableContainer}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...tableStyles.fixedColumn, ...tableStyles.serviceTypeColumn }}>
                  <ColumnHeader
                    label="TIPO SERVIZIO"
                    sortable
                    filterable
                    sortActive={sortField === 'serviceType'}
                    sortDirection={sortOrder}
                    onSort={() => handleSort('serviceType')}
                    filterValue={filters.serviceType}
                    onFilterChange={(value) => handleFilterChange('serviceType', value)}
                    filterOptions={[
                      { value: 'CARICO', label: 'CARICO', color: 'primary' },
                      { value: 'SCARICO', label: 'SCARICO', color: 'warning' },
                      { value: 'DEPOSITO', label: 'DEPOSITO', color: 'info' }
                    ]}
                  />
                </TableCell>
                <TableCell sx={tableStyles.clientCell}>
                  <ColumnHeader
                    label="CLIENTE"
                    sortable
                    sortActive={sortField === 'clients'}
                    sortDirection={sortOrder}
                    onSort={() => handleSort('clients')}
                  />
                </TableCell>
                <TableCell sx={{ ...tableStyles.fixedColumn, ...tableStyles.priorityColumn }}>
                  <ColumnHeader
                    label="PRIORITÀ"
                    sortable
                    filterable
                    sortActive={sortField === 'priority'}
                    sortDirection={sortOrder}
                    onSort={() => handleSort('priority')}
                    filterValue={filters.priority}
                    onFilterChange={(value) => handleFilterChange('priority', value)}
                    filterOptions={[
                      { value: 'EMERGENZA', label: 'EMERGENZA', color: 'error' },
                      { value: 'AXA', label: 'AXA', color: 'warning' },
                      { value: 'AGGIORNAMENTO', label: 'AGGIORNAMENTO', color: 'info' },
                      { value: 'ORDINARIO', label: 'ORDINARIO', color: 'default' }
                    ]}
                  />
                </TableCell>
                <TableCell sx={{ ...tableStyles.fixedColumn, ...tableStyles.statusColumn }}>
                  <ColumnHeader
                    label="STATO"
                    sortable
                    filterable
                    sortActive={sortField === 'status'}
                    sortDirection={sortOrder}
                    onSort={() => handleSort('status')}
                    filterValue={filters.status}
                    onFilterChange={(value) => handleFilterChange('status', value)}
                    filterOptions={[
                      { value: 'pending', label: 'IN ATTESA', color: 'default' },
                      { value: 'in_progress', label: 'IN CORSO', color: 'warning' },
                      { value: 'completed', label: 'COMPLETATO', color: 'success' }
                    ]}
                  />
                </TableCell>
                <TableCell sx={{ ...tableStyles.fixedColumn, ...tableStyles.timeColumn }}>
                  <ColumnHeader
                    label="ORARIO INIZIO"
                    sortable
                    sortActive={sortField === 'startTime'}
                    sortDirection={sortOrder}
                    onSort={() => handleSort('startTime')}
                  />
                </TableCell>
                <TableCell sx={{ ...tableStyles.fixedColumn, ...tableStyles.timeColumn }}>
                  <ColumnHeader
                    label="ORARIO FINE"
                    sortable
                    sortActive={sortField === 'endTime'}
                    sortDirection={sortOrder}
                    onSort={() => handleSort('endTime')}
                  />
                </TableCell>
                <TableCell sx={tableStyles.noteCell}>
                  <ColumnHeader label="NOTE UFFICIO" />
                </TableCell>
                <TableCell sx={tableStyles.noteCell}>
                  <ColumnHeader label="NOTE MAGAZZINO" />
                </TableCell>
                <TableCell sx={{ ...tableStyles.fixedColumn, ...tableStyles.actionColumn }}>
                  <ColumnHeader label="AZIONI" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                  <TableRow key={task._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip
                          label={task.serviceType}
                          color={getServiceTypeColor(task.serviceType)}
                          size="small"
                          sx={tableStyles.chip}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={tableStyles.clientCell}>
                      {task.clients.join(', ')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                          size="small"
                          sx={tableStyles.chip}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip
                          label={getStatusLabel(task.status)}
                          color={getStatusColor(task.status)}
                          size="small"
                          sx={tableStyles.chip}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">{task.startTime || '-'}</TableCell>
                    <TableCell align="center">{task.endTime || '-'}</TableCell>
                    <TableCell sx={tableStyles.noteCell}>{task.officeNotes || '-'}</TableCell>
                    <TableCell sx={tableStyles.noteCell}>{task.warehouseNotes || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Modifica stato e note">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(task)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography sx={{ py: 2 }}>
                      NESSUN TASK PER QUESTA DATA
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isEditing}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          textTransform: 'uppercase',
          fontWeight: 700,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white'
        }}>
          MODIFICA TASK
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <Select
                value={editedValues.status}
                onChange={(e) => setEditedValues(prev => ({
                  ...prev,
                  status: e.target.value as string
                }))}
              >
                <MenuItem value="pending">IN ATTESA</MenuItem>
                <MenuItem value="in_progress">IN CORSO</MenuItem>
                <MenuItem value="completed">COMPLETATO</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="NOTE MAGAZZINO"
              value={editedValues.warehouseNotes}
              onChange={(e) => setEditedValues(prev => ({
                ...prev,
                warehouseNotes: e.target.value
              }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleEditClose} variant="outlined">
            ANNULLA
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            SALVA
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WarehouseTaskTable;
