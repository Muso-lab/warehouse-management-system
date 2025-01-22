// src/components/office/TaskList.tsx
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const mockTasks = [
  {
    id: 1,
    title: 'Preparare spedizione #123',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Magazzino A',
    createdAt: '2024-01-21T10:00:00',
  },
  // Aggiungi altri task di esempio
];

const TaskList = () => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>Task Attivi</Typography>
      <List>
        {mockTasks.map((task) => (
          <ListItem
            key={task.id}
            sx={{
              border: '1px solid #eee',
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemText
              primary={task.title}
              secondary={`Assegnato a: ${task.assignedTo}`}
            />
            <ListItemSecondaryAction>
              <Chip
                label={task.priority}
                color={task.priority === 'high' ? 'error' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TaskList;

// src/components/office/TaskStats.tsx
import { Box, Typography, CircularProgress } from '@mui/material';

const TaskStats = () => {
  const stats = {
    total: 15,
    completed: 8,
    pending: 5,
    inProgress: 2,
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Statistiche</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={(stats.completed / stats.total) * 100}
            size={100}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round((stats.completed / stats.total) * 100)}%`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography>Completati: {stats.completed}</Typography>
        <Typography>In corso: {stats.inProgress}</Typography>
        <Typography>In attesa: {stats.pending}</Typography>
      </Box>
    </Box>
  );
};

export default TaskStats;
