import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { format, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { Task } from '../types/task';

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  byServiceType: {
    CARICO: number;
    SCARICO: number;
    LOGISTICA: number;
  };
  byPriority: {
    EMERGENZA: number;
    AXA: number;
    AGGIORNAMENTO: number;
    ORDINARIO: number;
  };
}

const initialStats: TaskStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  byServiceType: {
    CARICO: 0,
    SCARICO: 0,
    LOGISTICA: 0
  },
  byPriority: {
    EMERGENZA: 0,
    AXA: 0,
    AGGIORNAMENTO: 0,
    ORDINARIO: 0
  }
};

const Dashboard = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskStats, setTaskStats] = useState<TaskStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTaskStats();
  }, [selectedDate]);

  const loadTaskStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Formatta la data nel formato corretto
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('Fetching tasks for date:', dateStr); // Debug log

      // Usa getTasksByDate invece di getTasks
      const tasks = await taskService.getTasksByDate(dateStr);
      console.log('Received tasks:', tasks); // Debug log

      const stats: TaskStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        byServiceType: {
          CARICO: tasks.filter(t => t.serviceType === 'CARICO').length,
          SCARICO: tasks.filter(t => t.serviceType === 'SCARICO').length,
          LOGISTICA: tasks.filter(t => t.serviceType === 'LOGISTICA').length
        },
        byPriority: {
          EMERGENZA: tasks.filter(t => t.priority === 'EMERGENZA').length,
          AXA: tasks.filter(t => t.priority === 'AXA').length,
          AGGIORNAMENTO: tasks.filter(t => t.priority === 'AGGIORNAMENTO').length,
          ORDINARIO: tasks.filter(t => t.priority === 'ORDINARIO').length
        }
      };

      setTaskStats(stats);
    } catch (error) {
      console.error('Error loading task stats:', error);
      setError('Errore nel caricamento delle statistiche');
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

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
          gap: 2
        }}>
          <ButtonGroup variant="contained">
            <Button onClick={handlePreviousDay}>
              <ChevronLeftIcon />
            </Button>
            <Button onClick={handleToday}>
              Oggi
            </Button>
            <Button onClick={handleNextDay}>
              <ChevronRightIcon />
            </Button>
          </ButtonGroup>
        </Box>

        <Typography variant="h6" align="center" gutterBottom>
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
        </Typography>

        {/* Statistiche principali */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Totale Task
                </Typography>
                <Typography variant="h3">
                  {taskStats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Attesa
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {taskStats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Corso
                </Typography>
                <Typography variant="h3" color="info.main">
                  {taskStats.inProgress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completati
                </Typography>
                <Typography variant="h3" color="success.main">
                  {taskStats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistiche per tipo di servizio */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Per Tipo di Servizio
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(taskStats.byServiceType).map(([type, count]) => (
              <Grid item xs={12} sm={4} key={type}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {type}
                    </Typography>
                    <Typography variant="h4">
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Statistiche per priorità */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Per Priorità
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(taskStats.byPriority).map(([priority, count]) => (
              <Grid item xs={12} sm={3} key={priority}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {priority}
                    </Typography>
                    <Typography variant="h4">
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
