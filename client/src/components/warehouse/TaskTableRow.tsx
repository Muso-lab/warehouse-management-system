// client/src/components/warehouse/TaskTableRow.tsx
import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Task } from '../../types/task';
import { tableStyles } from '../../styles/tableStyles';
import { getStatusColor, getStatusLabel, getPriorityColor, getServiceTypeColor } from '../../utils/taskHelpers';

interface TaskTableRowProps {
  task: Task;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
}

const TaskTableRow: React.FC<TaskTableRowProps> = ({ task, onEdit }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={task.serviceType}
            color={getServiceTypeColor(task.serviceType)}
            size="small"
            sx={tableStyles.chip}
          />
        </Box>
      </TableCell>
      <TableCell sx={tableStyles.clientCell}>
        {task.clients.join(', ')}
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
            sx={tableStyles.chip}
          />
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={getStatusLabel(task.status)}
            color={getStatusColor(task.status)}
            size="small"
            sx={tableStyles.chip}
          />
        </Box>
      </TableCell>
      <TableCell align="center">{task.startTime || '-'}</TableCell>
      <TableCell align="center">{task.endTime || '-'}</TableCell>
      <TableCell sx={tableStyles.noteCell}>{task.officeNotes || '-'}</TableCell>
      <TableCell sx={tableStyles.noteCell}>{task.warehouseNotes || '-'}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title="Modifica stato e note">
            <IconButton
              size="small"
              onClick={() => onEdit(task._id!, task)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;
