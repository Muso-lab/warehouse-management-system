import { Box, Paper, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import TaskTable from '../components/tasks/TaskTable';
import TaskFilters from '../components/tasks/TaskFilters';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { Task } from '../types/task';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    serviceType: '',
    priority: '',
    status: '',
    client: '',
    vehicleData: ''
  });

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  useEffect(() => {
    // Applica i filtri ai task
    let filtered = tasks;

    // Filtra per data
    filtered = filtered.filter(task => task.date === selectedDate);

    // Applica gli altri filtri
    if (filters.serviceType) {
      filtered = filtered.filter(task => task.serviceType === filters.serviceType);
    }
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.client) {
      filtered = filtered.filter(task => task.clients.includes(filters.client));
    }
    if (filters.vehicleData) {
      filtered = filtered.filter(task =>
        task.vehicleData?.toLowerCase().includes(filters.vehicleData.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [selectedDate, tasks, filters]);

  const loadTasks = async () => {
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
  };

  const handleSaveTask = async (taskData: any) => {
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

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    setFilteredTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await taskService.updateTask(taskId, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, ...updated } : task
        )
      );
    } catch (err) {
      setError('Errore nell\'aggiornamento del task');
      console.error('Error updating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({
            serviceType: '',
            priority: '',
            status: '',
            client: '',
            vehicleData: ''
          })}
        />

        <Paper sx={{ width: '100%', mb: 2, position: 'relative' }}>
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
            onUpdateTask={handleUpdateTask}
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
