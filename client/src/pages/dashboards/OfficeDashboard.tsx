import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const OfficeDashboard = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Dashboard Ufficio</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Nuovo task')}
        >
          Nuovo Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task in Attesa
            </Typography>
            <Typography variant="h3" sx={{ color: 'primary.main' }}>
              5
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task in Corso
            </Typography>
            <Typography variant="h3" sx={{ color: 'secondary.main' }}>
              3
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Completati
            </Typography>
            <Typography variant="h3" sx={{ color: 'success.main' }}>
              12
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Task Recenti
            </Typography>
            {/* Lista task recenti */}
            <Typography color="text.secondary">
              Nessun task recente da visualizzare
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OfficeDashboard;
