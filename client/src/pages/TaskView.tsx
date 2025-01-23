import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import TaskTable from '../components/tasks/TaskTable';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { Task } from '../types/task';
import { taskService } from '../services/taskService';
import { format, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

const TaskView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const fetchedTasks = await taskService.getTasksByDate(dateStr);
      setTasks(fetchedTasks);
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
      setError('Errore durante l\'aggiornamento del task');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setSuccessMessage('Task eliminato con successo');
      await loadTasks();
    } catch (err) {
      setError('Errore durante l\'eliminazione del task');
      console.error('Error deleting task:', err);
    }
  };

  const handleCreateTask = async (newTask: Omit<Task, '_id'>) => {
    try {
      await taskService.createTask(newTask);
      setSuccessMessage('Task creato con successo');
      await loadTasks();
      setIsNewTaskModalOpen(false);
    } catch (err) {
      setError('Errore durante la creazione del task');
      console.error('Error creating task:', err);
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h4">
          Gestione Task
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          Nuovo Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2
        }}>
          <ButtonGroup variant="contained">
            <Button onClick={handlePreviousDay}>
              <ChevronLeftIcon />
            </Button>
            <Button onClick={handleToday} startIcon={<TodayIcon />}>
              Oggi
            </Button>
            <Button onClick={handleNextDay}>
              <ChevronRightIcon />
            </Button>
          </ButtonGroup>
          <Typography variant="h6">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
          </Typography>
        </Box>
      </Paper>

      <TaskTable
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        userRole="office"
      />

      <NewTaskModal
        open={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSave={handleCreateTask}
        selectedDate={selectedDate}
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

export default TaskView;
