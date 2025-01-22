import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { keyframes } from '@mui/system';
import { Task } from '../../types/task';

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

interface MonitorTaskListProps {
  tasks: Task[];
}

interface GroupedTasks {
  [priority: string]: {
    [serviceType: string]: Task[];
  };
}

const MonitorTaskList: React.FC<MonitorTaskListProps> = ({ tasks }) => {
  const priorityLabels = {
    'EMERGENZA': 'Emergenza',
    'AXA': 'AXA',
    'AGGIORNAMENTO': 'Aggiornamento',
    'ORDINARIO': 'Ordinario'
  };

  const serviceTypeLabels = {
    'CARICO': 'Carico',
    'SCARICO': 'Scarico',
    'LOGISTICA': 'Logistica'
  };

  const serviceTypeColors = {
    'CARICO': '#4caf50',    // verde
    'SCARICO': '#f44336',   // rosso
    'LOGISTICA': '#2196f3'  // blu
  };

  const priorityColors = {
    'EMERGENZA': 'error',
    'AXA': 'warning',
    'AGGIORNAMENTO': 'info',
    'ORDINARIO': 'success'
  };

  const priorityBackgroundColors = {
    'EMERGENZA': '#ffebee',
    'AXA': '#fff3e0',
    'AGGIORNAMENTO': '#e1f5fe',
    'ORDINARIO': '#e8f5e9'
  };

  const priorityOrder = ['EMERGENZA', 'AXA', 'AGGIORNAMENTO', 'ORDINARIO'];
  const serviceTypeOrder = ['CARICO', 'SCARICO', 'LOGISTICA'];

  const groupedTasks = tasks.reduce((acc: GroupedTasks, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = {};
    }
    if (!acc[task.priority][task.serviceType]) {
      acc[task.priority][task.serviceType] = [];
    }
    acc[task.priority][task.serviceType].push(task);
    return acc;
  }, {});

  const PriorityHeader = ({ priority, count }: { priority: string; count: number }) => (
    <Box
      sx={{
        width: '100%',
        mb: 2,
        py: 1,
        backgroundColor: priorityBackgroundColors[priority as keyof typeof priorityBackgroundColors],
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        animation: priority === 'EMERGENZA' ? `${blink} 2s infinite` : 'none',
        boxShadow: 2,
        gap: 2
      }}
    >
      <Chip
        label={priorityLabels[priority as keyof typeof priorityLabels]}
        color={priorityColors[priority as keyof typeof priorityColors] as any}
        sx={{
          fontSize: '1rem',
          padding: '10px 20px',
          height: 'auto',
          '& .MuiChip-label': {
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: priority === 'EMERGENZA' ? '#d32f2f' : 'inherit'
        }}
      >
        {count} {count === 1 ? 'Task' : 'Tasks'}
      </Typography>
    </Box>
  );

  if (tasks.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Nessun task attivo per questa data
      </Typography>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="15%">Tipo Servizio</TableCell>
              <TableCell width="20%">Cliente</TableCell>
              <TableCell width="15%">Veicolo</TableCell>
              <TableCell width="10%">Stato</TableCell>
              <TableCell width="20%">Note Ufficio</TableCell>
              <TableCell width="20%">Note Magazzino</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {priorityOrder.map(priority => {
        if (!groupedTasks[priority]) return null;
        const priorityTasksCount = Object.values(groupedTasks[priority])
          .flat()
          .length;

        return (
          <Box key={priority} sx={{ mb: 4 }}>
            <PriorityHeader priority={priority} count={priorityTasksCount} />

            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {Object.entries(groupedTasks[priority])
                    .sort(([serviceTypeA], [serviceTypeB]) => {
                      return serviceTypeOrder.indexOf(serviceTypeA) - serviceTypeOrder.indexOf(serviceTypeB);
                    })
                    .map(([serviceType, serviceTasks]) => (
                      serviceTasks.map((task) => (
                        <TableRow
                          key={task._id}
                          sx={{
                            backgroundColor: priorityBackgroundColors[priority as keyof typeof priorityBackgroundColors],
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            }
                          }}
                        >
                          <TableCell width="15%">
                            <Typography
                              sx={{
                                color: serviceTypeColors[task.serviceType as keyof typeof serviceTypeColors],
                                fontWeight: 'bold'
                              }}
                            >
                              {serviceTypeLabels[task.serviceType as keyof typeof serviceTypeLabels]}
                            </Typography>
                          </TableCell>
                          <TableCell width="20%">{task.clients.join(', ')}</TableCell>
                          <TableCell width="15%">{task.vehicleData || '-'}</TableCell>
                          <TableCell width="10%">
                            <Chip
                              label={task.status === 'pending' ? 'In attesa' :
                                    task.status === 'in_progress' ? 'In corso' : 'Completato'}
                              color={task.status === 'pending' ? 'warning' :
                                    task.status === 'in_progress' ? 'info' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell width="20%">{task.officeNotes || '-'}</TableCell>
                          <TableCell width="20%">{task.warehouseNotes || '-'}</TableCell>
                        </TableRow>
                      ))
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </Box>
  );
};

export default MonitorTaskList;
