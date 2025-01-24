// client/src/components/office/OfficeTaskView.tsx
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
  Add as AddIcon,
} from '@mui/icons-material';
import PageHeader from '../common/layout/PageHeader';
import TaskTable from '../common/table/TaskTable';
import { useTask } from '../common/providers/TaskProvider';
import { Task } from '../../types/task';
import { tableStyles } from '../../styles/tableStyles';
import NewTaskModal from '../tasks/NewTaskModal'; // Questo componente lo manteniamo per la creazione dei task

// Configurazione colonne per la vista ufficio
const officeColumns = [
  {
    id: 'serviceType',
    label: 'TIPO SERVIZIO',
    sortable: true,
    filterable: true,
    width: '130px',
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
    width: '150px'
  },
  {
    id: 'priority',
    label: 'PRIORITÀ',
    sortable: true,
    filterable: true,
    width: '120px',
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
    width: '120px',
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
    width: '100px'
  },
  {
    id: 'endTime',
    label: 'ORARIO FINE',
    sortable: true,
    width: '100px'
  },
  {
    id: 'officeNotes',
    label: 'NOTE UFFICIO',
    width: '200px'
  },
  {
    id: 'warehouseNotes',
    label: 'NOTE MAGAZZINO',
    width: '200px'
  },
  {
    id: 'actions',
    label: 'AZIONI',
    width: '80px',
    align: 'center'
  }
];

// Helper functions
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

const OfficeTaskView: React.FC = () => {
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
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [selectedDate, loadTasks]);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsNewTaskModalOpen(true);
  };

  const handleModalClose = () => {
    setIsNewTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleCreateTask = async (taskData: Omit<Task, '_id'>) => {
    try {
      console.log('Creating task:', taskData);
      // Qui andrà la logica di creazione task
      setIsNewTaskModalOpen(false);
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      await updateTask(taskId, taskData);
      setIsNewTaskModalOpen(false);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
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
            title="Modifica task"
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
      ml: '240px',
      height: '100%',
      overflow: 'auto'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <PageHeader
          title="Gestione Task"
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewTaskModalOpen(true)}
          sx={{ height: 'fit-content' }}
        >
          Nuovo Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TaskTable
        tasks={tasks}
        loading={loading}
        columns={officeColumns}
        renderRow={renderTaskRow}
        initialSort={{ field: 'startTime', order: 'asc' }}
      />

      <NewTaskModal
        open={isNewTaskModalOpen}
        onClose={handleModalClose}
        onSave={editingTask ?
          (taskData) => handleUpdateTask(editingTask._id!, taskData) :
          handleCreateTask}
        selectedDate={selectedDate}
        editTask={editingTask}
      />

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

export default OfficeTaskView;
