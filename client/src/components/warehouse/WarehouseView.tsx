import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import TaskTable from '../tasks/TaskTable';
import TaskFilters from '../tasks/TaskFilters';
import { Task, ServiceType, PriorityType, StatusType } from '../../types/task';
import { taskService } from '../../services/taskService';

interface FilterValues {
  serviceType: ServiceType | '';
  priority: PriorityType | '';
  status: StatusType | '';
  client: string;
  vehicleData: string;
}

const initialFilters: FilterValues = {
  serviceType: '',
  priority: '',
  status: '',
  client: '',
  vehicleData: ''
};

const WarehouseView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks();
      console.log('Fetched tasks:', fetchedTasks);
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Errore nel caricamento dei task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, updatedTask);
      setSuccessMessage('Task aggiornato con successo');
      await loadTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Errore durante l\'aggiornamento del task');
    }
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    let filtered = [...tasks];

    if (newFilters.serviceType) {
      filtered = filtered.filter(task => task.serviceType === newFilters.serviceType);
    }
    if (newFilters.priority) {
      filtered = filtered.filter(task => task.priority === newFilters.priority);
    }
    if (newFilters.status) {
      filtered = filtered.filter(task => task.status === newFilters.status);
    }
    if (newFilters.client) {
      filtered = filtered.filter(task => task.clients.includes(newFilters.client));
    }
    if (newFilters.vehicleData) {
      filtered = filtered.filter(task =>
        task.vehicleData?.toLowerCase().includes(newFilters.vehicleData.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setFilteredTasks(tasks);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestione Magazzino
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </Paper>

      <TaskTable
        tasks={filteredTasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={() => {}} // Funzione vuota perché il magazzino non può eliminare
        userRole="magazzino"
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WarehouseView;
