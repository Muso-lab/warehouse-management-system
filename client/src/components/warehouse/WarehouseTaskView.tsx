// client/src/components/warehouse/WarehouseTaskView.tsx
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
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { format, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import PageContainer from '../layout/PageContainer';
import TaskTable from '../tasks/TaskTable';
import { taskService } from '../../services/taskService';
import { Task } from '../../types/task';

const WarehouseTaskView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('WarehouseTaskView - Requesting tasks for date:', dateStr);

      const data = await taskService.getTasksByDate(dateStr);
      console.log('WarehouseTaskView - Received tasks:', data);

      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('WarehouseTaskView - Error loading tasks:', err);
      setError('Errore nel caricamento dei task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      setLoading(true);
      // Permetti solo l'aggiornamento di stato e note magazzino
      const allowedUpdates = {
        status: updatedTask.status,
        warehouseNotes: updatedTask.warehouseNotes
      };

      await taskService.updateTask(taskId, allowedUpdates);
      setSuccessMessage('Task aggiornato con successo');
      await loadTasks();
    } catch (err) {
      console.error('WarehouseTaskView - Error updating task:', err);
      setError('Errore durante l\'aggiornamento del task');
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

  return (
    <PageContainer title="Gestione Magazzino">
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mb: 3
      }}>
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
        onUpdateTask={handleUpdateTask}
        userRole="magazzino"
        editableFields={['status', 'warehouseNotes']}
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

export default WarehouseTaskView;
