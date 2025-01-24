// client/src/components/warehouse/WarehouseDashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { useTask } from '../../components/common/providers/TaskProvider';
import { Task } from '../../types/task';

const WarehouseDashboard: React.FC = () => {
  const { tasks, loading, error } = useTask();
  const [stats, setStats] = useState({
    totalToday: 0,
    inProgress: 0,
    urgent: 0,
    completed: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      // Calcola le statistiche
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = tasks.filter(task =>
        task.date?.toString().includes(today)
      );

      setStats({
        totalToday: todayTasks.length,
        inProgress: todayTasks.filter(t => t.status === 'in_progress').length,
        urgent: todayTasks.filter(t => t.priority === 'EMERGENZA').length,
        completed: todayTasks.filter(t => t.status === 'completed').length,
      });

      // Imposta i task recenti
      const recent = [...tasks]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() -
                        new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 5);
      setRecentTasks(recent);
    }
  }, [tasks]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          ml: '240px' // Mantiene l'allineamento anche durante il caricamento
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, ml: '240px' }}> {/* Mantiene l'allineamento in caso di errore */}
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      ml: '240px',  // Margine per la Sidebar
      height: '100%',
      overflow: 'auto'
    }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard Magazzino
      </Typography>

      {/* Statistiche */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minHeight: '100px'
            }}
          >
            <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4">{stats.totalToday}</Typography>
              <Typography variant="subtitle2">Task Oggi</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minHeight: '100px'
            }}
          >
            <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4">{stats.inProgress}</Typography>
              <Typography variant="subtitle2">In Corso</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minHeight: '100px'
            }}
          >
            <WarningIcon color="error" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4">{stats.urgent}</Typography>
              <Typography variant="subtitle2">Urgenti</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minHeight: '100px'
            }}
          >
            <UpdateIcon color="success" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4">{stats.completed}</Typography>
              <Typography variant="subtitle2">Completati</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Task Recenti */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Ultimi Task Aggiornati
          </Typography>
          <List>
            {recentTasks.map((task, index) => (
              <React.Fragment key={task._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={task.serviceType}
                          size="small"
                          color="primary"
                          sx={{ minWidth: '80px' }}
                        />
                        <Typography>
                          {task.clients.join(', ')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={task.status === 'completed' ? 'COMPLETATO' :
                                task.status === 'in_progress' ? 'IN CORSO' :
                                'IN ATTESA'}
                          size="small"
                          color={task.status === 'completed' ? 'success' :
                                task.status === 'in_progress' ? 'warning' :
                                'default'}
                          sx={{ mr: 1, minWidth: '100px' }}
                        />
                        <Typography
                          variant="caption"
                          component="span"
                          sx={{
                            ml: 1,
                            color: 'text.secondary',
                            display: 'inline-block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {task.warehouseNotes || 'Nessuna nota'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentTasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {recentTasks.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nessun task recente"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WarehouseDashboard;
