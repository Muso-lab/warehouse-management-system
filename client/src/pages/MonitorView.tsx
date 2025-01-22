import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ButtonGroup,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Task } from '../types/task';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import MonitorTaskList from '../components/monitor/MonitorTaskList';

const MonitorView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'monitor') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('Requesting tasks for date:', dateStr);

      const loadedTasks = await taskService.getTasksByDate(dateStr);
      console.log('Loaded tasks:', loadedTasks);

      if (!Array.isArray(loadedTasks)) {
        throw new Error('Loaded tasks is not an array');
      }

      const filteredTasks = loadedTasks
        .filter(task => {
          console.log('Checking task:', task);
          return task.status !== 'completed';
        })
        .sort((a, b) => {
          const priorityOrder = {
            'EMERGENZA': 0,
            'AXA': 1,
            'AGGIORNAMENTO': 2,
            'ORDINARIO': 3
          };
          return priorityOrder[a.priority as keyof typeof priorityOrder] -
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        });

      console.log('Filtered tasks:', filteredTasks);
      setTasks(filteredTasks);
    } catch (err) {
      console.error('Detailed error:', err);
      setError('Errore nel caricamento dei task');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  if (!user || user.role !== 'monitor') {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        overflow: 'auto'
      }}>
        <Box sx={{
          position: 'sticky',
          top: '64px',
          backgroundColor: '#f5f5f5',
          p: 2,
          zIndex: 1000,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          mt: '64px'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ButtonGroup variant="contained" size="large">
              <Button onClick={handlePrevDay}>Precedente</Button>
              <Button onClick={handleToday}>Oggi</Button>
              <Button onClick={handleNextDay}>Successivo</Button>
            </ButtonGroup>
          </Box>
          <Typography variant="h5" align="center">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MonitorTaskList tasks={tasks} />
          )}

          {!isLoading && tasks.length === 0 && (
            <Typography variant="h5" align="center" sx={{ mt: 4 }}>
              Nessun task attivo per questa data
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MonitorView;
