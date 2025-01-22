import { Grid, Paper, Typography, Box } from '@mui/material';

const WarehouseDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Magazzino Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Task in Coda</Typography>
            {/* TaskQueue component will go here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Task Attivi</Typography>
            {/* ActiveTasks component will go here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseDashboard;
