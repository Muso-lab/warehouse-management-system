import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect, useCallback } from 'react';  // Aggiunto useCallback
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import TaskTable from '../components/tasks/TaskTable';
import TaskFilters from '../components/tasks/TaskFilters';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { Task } from '../types/task';
import { taskService } from '../services/taskService';

// Interfaccia per i filtri
interface Filters {
  serviceType: string;
  priority: string;
  status: string;
  client: string;
  vehicleData: string;
}

const initialFilters: Filters = {
  serviceType: '',
  priority: '',
  status: '',
  client: '',
  vehicleData: ''
};

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  // Ottimizzato con useCallback
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTasks = await taskService.getTasksByDate(selectedDate);
      setTasks(loadedTasks);
    } catch (err) {
      setError('Errore nel caricamento dei task');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // Ottimizzato con useCallback
  const applyFilters = useCallback((tasksToFilter: Task[]) => {
    return tasksToFilter
      .filter(task => task.date === selectedDate)
      .filter(task => !filters.serviceType || task.serviceType === filters.serviceType)
      .filter(task => !filters.priority || task.priority === filters.priority)
      .filter(task => !filters.status || task.status === filters.status)
      .filter(task => !filters.client || task.clients.includes(filters.client))
      .filter(task => !filters.vehicleData ||
        task.vehicleData?.toLowerCase().includes(filters.vehicleData.toLowerCase())
      );
  }, [selectedDate, filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const filtered = applyFilters(tasks);
    setFilteredTasks(filtered);
  }, [tasks, applyFilters]);

  const handleSaveTask = async (taskData: Task) => {
    try {
      setIsLoading(true);
      setError(null);
      const newTask = await taskService.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setIsModalOpen(false);
    } catch (err) {
      setError('Errore nel salvataggio del task');
      console.error('Error saving task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
  }, []);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4">Task Attivi</Typography>
            <TextField
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{ ml: 2 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
          >
            Nuovo Task
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <Paper sx={{
          width: '100%',
          mb: 2,
          position: 'relative',
          overflow: 'hidden' // Aggiunto per gestire meglio il loading overlay
        }}>
          {isLoading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}>
              <CircularProgress />
            </Box>
          )}
          <TaskTable
            tasks={filteredTasks}
            onDeleteTask={handleDeleteTask}
          />
        </Paper>

        <NewTaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
