// client/src/components/office/OfficeDashboard.tsx

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
import PageHeader from '../common/layout/PageHeader';
import { Task } from '../../types/task';

const OfficeDashboard: React.FC = () => {
  const { tasks, loading, error, selectedDate, setSelectedDate } = useTask();
  const [stats, setStats] = useState({
    totalToday: 0,
    pending: 0,
    urgent: 0,
    completed: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
  if (tasks) {
    // Usa selectedDate invece di today
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    console.log('Selected date:', selectedDateStr); // Debug
    console.log('All tasks:', tasks); // Debug

    // Filtra i task per la data selezionata
    const filteredTasks = tasks.filter(task =>
      task.date?.toString().includes(selectedDateStr)
    );
    console.log('Filtered tasks:', filteredTasks); // Debug

    setStats({
      totalToday: filteredTasks.length,
      pending: filteredTasks.filter(t => t.status === 'pending').length,
      urgent: filteredTasks.filter(t => t.priority === 'EMERGENZA').length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
    });

    // Aggiorna anche i task recenti filtrando per la data selezionata
    const recent = [...filteredTasks]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() -
                      new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, 5);
    setRecentTasks(recent);
  }
}, [tasks, selectedDate]); // Aggiungi selectedDate alle dipendenze

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          ml: '240px'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, ml: '240px' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      ml: '240px',
      height: '100%',
      overflow: 'auto'
    }}>
    <PageHeader
  title="Dashboard Ufficio"
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  showDateSelector={true}  // Esplicitamente impostato a true
/>

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
              <Typography variant="h4">{stats.pending}</Typography>
              <Typography variant="subtitle2">Da Assegnare</Typography>
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
            Ultimi Task Creati/Modificati
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
                          {task.officeNotes || 'Nessuna nota'}
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

export default OfficeDashboard;
