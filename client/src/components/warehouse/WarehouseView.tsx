// client/src/components/warehouse/WarehouseView.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  TableRow,
  TableCell,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';
import PageHeader from '../common/layout/PageHeader';
import TaskTable from '../common/table/TaskTable';
import { useTask } from '../common/providers/TaskProvider';
import { Task } from '../../types/task';
import { tableStyles } from '../../styles/tableStyles';

// Configurazione delle colonne per la vista magazzino
const warehouseColumns = [
  {
    id: 'serviceType',
    label: 'TIPO SERVIZIO',
    sortable: true,
    filterable: true,
    ...tableStyles.serviceTypeColumn,
    filterOptions: [
      { value: 'CARICO', label: 'CARICO', color: 'primary' },
      { value: 'SCARICO', label: 'SCARICO', color: 'warning' },
      { value: 'DEPOSITO', label: 'DEPOSITO', color: 'info' }
    ]
  },
  {
    id: 'clients',
    label: 'CLIENTE',
    sortable: true,
    ...tableStyles.clientCell,
  },
  {
    id: 'priority',
    label: 'PRIORITÀ',
    sortable: true,
    filterable: true,
    ...tableStyles.priorityColumn,
    filterOptions: [
      { value: 'EMERGENZA', label: 'EMERGENZA', color: 'error' },
      { value: 'AXA', label: 'AXA', color: 'warning' },
      { value: 'AGGIORNAMENTO', label: 'AGGIORNAMENTO', color: 'info' },
      { value: 'ORDINARIO', label: 'ORDINARIO', color: 'default' }
    ]
  },
  {
    id: 'status',
    label: 'STATO',
    sortable: true,
    filterable: true,
    ...tableStyles.statusColumn,
    filterOptions: [
      { value: 'pending', label: 'IN ATTESA', color: 'default' },
      { value: 'in_progress', label: 'IN CORSO', color: 'warning' },
      { value: 'completed', label: 'COMPLETATO', color: 'success' }
    ]
  },
  {
    id: 'startTime',
    label: 'ORARIO INIZIO',
    sortable: true,
    ...tableStyles.timeColumn
  },
  {
    id: 'endTime',
    label: 'ORARIO FINE',
    sortable: true,
    ...tableStyles.timeColumn
  },
  {
    id: 'officeNotes',
    label: 'NOTE UFFICIO',
    ...tableStyles.noteCell
  },
  {
    id: 'warehouseNotes',
    label: 'NOTE MAGAZZINO',
    ...tableStyles.noteCell
  },
  {
    id: 'actions',
    label: 'AZIONI',
    ...tableStyles.actionColumn,
    align: 'center'
  }
];

// Helper functions per colori e etichette
const getServiceTypeColor = (type: string) => {
  switch (type) {
    case 'CARICO': return 'primary';
    case 'SCARICO': return 'warning';
    case 'DEPOSITO': return 'info';
    default: return 'default';
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
const WarehouseView: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    successMessage,
    selectedDate,
    setSelectedDate,
    loadTasks,
    updateTask,
    clearSuccessMessage,
  } = useTask();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedValues, setEditedValues] = useState({
    status: '',
    warehouseNotes: ''
  });

  useEffect(() => {
    loadTasks();
  }, [selectedDate, loadTasks]);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditedValues({
      status: task.status,
      warehouseNotes: task.warehouseNotes || ''
    });
  };

  const handleEditClose = () => {
    setEditingTask(null);
    setEditedValues({ status: '', warehouseNotes: '' });
  };

  const handleEditSave = async () => {
    if (editingTask) {
      try {
        await updateTask(editingTask._id!, editedValues);
        handleEditClose();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const renderTaskRow = (task: Task) => (
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
      <TableCell sx={tableStyles.clientCell}>{task.clients.join(', ')}</TableCell>
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
          <IconButton
            size="small"
            onClick={() => handleEditClick(task)}
            title="Modifica stato e note"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{
      p: 3,
      pt: 2,
      ml: '240px',  // Margine per la Sidebar
      height: '100%',
      overflow: 'auto'
    }}>
      <PageHeader
        title="Gestione Magazzino"
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TaskTable
        tasks={tasks}
        loading={loading}
        columns={warehouseColumns}
        renderRow={renderTaskRow}
        initialSort={{ field: 'startTime', order: 'asc' }}
      />

      <Dialog
        open={!!editingTask}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          textTransform: 'uppercase',
          fontWeight: 700,
          backgroundColor: theme => theme.palette.primary.main,
          color: 'white',
          py: 2
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
          <Button
            onClick={handleEditClose}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            ANNULLA
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            color="primary"
          >
            SALVA
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={clearSuccessMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={clearSuccessMessage}
          severity="success"
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WarehouseView;
