import { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import { taskService } from '../services/taskService';

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

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });

  const loadDashboardData = async () => {
    try {
      const response = await taskService.getTaskStats();
      console.log('Dashboard stats:', response); // Per debug
      setTaskStats(response);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <PageContainer title="Dashboard">
      <Grid container spacing={3}>
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
    </PageContainer>
  );
};

export default Dashboard;
