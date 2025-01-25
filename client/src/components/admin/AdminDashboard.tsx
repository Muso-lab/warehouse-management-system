// src/components/admin/AdminDashboard.tsx

import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useTask } from '../common/providers/TaskProvider';
import { taskService } from '../../services/taskService';
import PageContainer from '../layout/PageContainer';
import TaskTable from '../common/table/TaskTable';
import { Task } from '../../types/task';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

const DashboardCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      height: '100%',
      backgroundColor: color,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Typography variant="h6" gutterBottom component="div" align="center">
      {title}
    </Typography>
    <Typography variant="h3" component="div" align="center">
      {value}
    </Typography>
  </Paper>
);

const AdminDashboard: React.FC = () => {
  const { tasks, loading, error, loadTasks } = useTask();
  const [taskStats, setTaskStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });

  // Debug log per verificare i tasks
  console.log('AdminDashboard - tasks:', tasks);
  console.log('AdminDashboard - loading:', loading);

  const adminColumns = [
    { id: 'id', label: 'ID', sortable: true, align: 'left' },
    { id: 'client', label: 'Cliente', sortable: true, align: 'left' },
    { id: 'description', label: 'Descrizione', sortable: true, align: 'left' },
    { id: 'status', label: 'Stato', sortable: true, align: 'left' },
    { id: 'assignedTo', label: 'Assegnato a', sortable: true, align: 'left' },
    { id: 'priority', label: 'Priorità', sortable: true, align: 'left' },
    { id: 'actions', label: 'Azioni', sortable: false, align: 'center' }
  ];

  const loadDashboardData = async () => {
    try {
      const response = await taskService.getTaskStats();
      console.log('Dashboard stats loaded:', response);
      setTaskStats(response);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadTasks();
  }, [loadTasks]);

  const handleUpdateTask = (taskId: string, task: Task) => {
    console.log('Update task:', taskId, task);
    // Implementa la logica di aggiornamento
  };

  const handleDeleteTask = (taskId: string) => {
    console.log('Delete task:', taskId);
    // Implementa la logica di eliminazione
  };

  return (
    <PageContainer title="Dashboard Amministratore">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Task Totali"
            value={taskStats.total}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Task Completati"
            value={taskStats.completed}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Task in Corso"
            value={taskStats.inProgress}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Task in Attesa"
            value={taskStats.pending}
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Task Recenti
        </Typography>
        <TaskTable
          tasks={tasks || []}
          loading={loading}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </Paper>
    </PageContainer>
  );
};

export default AdminDashboard;
