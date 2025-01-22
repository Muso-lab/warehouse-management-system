import { Paper, Typography, Box } from '@mui/material';

const MonitorDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Monitor Dashboard
      </Typography>

      <Paper sx={{ p: 2, minHeight: '70vh' }}>
        <Typography variant="h6">Status Board</Typography>
        {/* StatusBoard component will go here */}
      </Paper>
    </Box>
  );
};

export default MonitorDashboard;
