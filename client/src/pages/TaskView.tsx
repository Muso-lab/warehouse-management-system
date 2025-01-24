import React, { useState, useEffect } from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { format, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import PageContainer from '../components/layout/PageContainer';
import TaskTable from '../components/tasks/TaskTable';
import NewTaskModal from '../components/tasks/NewTaskModal';
import { taskService } from '../services/taskService';
import { Task } from '../types/task';

const TaskView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('TaskView - Requesting tasks for date:', dateStr);

      const data = await taskService.getTasksByDate(dateStr);
      console.log('TaskView - Received tasks:', data);

      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('TaskView - Error loading tasks:', err);
      setError('Errore nel caricamento dei task');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, '_id'>) => {
  try {
    setLoading(true);
    console.log('TaskView - Creating task with data:', taskData);

    // Assicuriamoci che tutti i campi necessari siano presenti
    const dataToSend = {
      ...taskData,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: taskData.status || 'pending',
      clients: Array.isArray(taskData.clients) ? taskData.clients : [],
      vehicleData: taskData.vehicleData || '',
      startTime: taskData.startTime || '',
      endTime: taskData.endTime || '',
      officeNotes: taskData.officeNotes || '',
      warehouseNotes: taskData.warehouseNotes || ''
    };

    console.log('TaskView - Sending data:', dataToSend);
    await taskService.createTask(dataToSend);

    setSuccessMessage('Task creato con successo');
    await loadTasks();
    setIsNewTaskModalOpen(false);
  } catch (err) {
    console.error('TaskView - Error creating task:', err);
    if (err.response) {
      console.error('TaskView - Server error response:', err.response.data);
    }
    setError('Errore durante la creazione del task');
  } finally {
    setLoading(false);
  }
};

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      setLoading(true);
      console.log('TaskView - Updating task:', taskId, 'with data:', updatedTask);

      const dataToSend = {
        ...updatedTask,
        clients: Array.isArray(updatedTask.clients) ? updatedTask.clients : [],
        date: format(selectedDate, 'yyyy-MM-dd')
      };

      console.log('TaskView - Sending update data:', dataToSend);

      await taskService.updateTask(taskId, dataToSend);
      setSuccessMessage('Task aggiornato con successo');
      await loadTasks();
      setIsNewTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('TaskView - Error updating task:', err);
      setError('Errore durante l\'aggiornamento del task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      console.log('TaskView - Deleting task:', taskId);
      await taskService.deleteTask(taskId);
      setSuccessMessage('Task eliminato con successo');
      await loadTasks();
    } catch (err) {
      console.error('TaskView - Error deleting task:', err);
      setError('Errore durante l\'eliminazione del task');
    } finally {
      setLoading(false);
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

  const handleModalClose = () => {
    setIsNewTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <PageContainer title="Task">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          Nuovo Task
        </Button>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <ButtonGroup variant="contained" size="small">
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
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TaskTable
        tasks={tasks}
        loading={loading}
        onUpdateTask={(taskId, task) => {
          console.log('Setting editing task:', task);
          setEditingTask(task);
          setIsNewTaskModalOpen(true);
        }}
        onDeleteTask={handleDeleteTask}
      />

      <NewTaskModal
        open={isNewTaskModalOpen}
        onClose={handleModalClose}
        onSave={editingTask ?
          (taskData) => handleUpdateTask(editingTask._id!, taskData) :
          handleCreateTask
        }
        selectedDate={selectedDate}
        editTask={editingTask}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default TaskView;
