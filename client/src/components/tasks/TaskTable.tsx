import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { Task, SERVICE_TYPE_COLORS, PRIORITY_COLORS } from '../../types/task';
import ConfirmDialog from '../common/ConfirmDialog';
import EditTaskModal from './EditTaskModal';
import { taskService } from '../../services/taskService';

const tableHeaderStyle = {
  fontWeight: 'bold',
  fontSize: '0.95rem',
  textTransform: 'uppercase',
  color: 'primary.main'
};

const getStatusColor = (status: Task['status']) => ({
  pending: 'warning',
  in_progress: 'info',
  completed: 'success'
}[status]);

interface TaskTableProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void;
}

const TaskTable = ({ tasks, onDeleteTask, onUpdateTask }: TaskTableProps) => {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDeleteClick = (taskId: string) => {
    setError(null);
    setDeleteTaskId(taskId);
  };

  const handleConfirmDelete = async () => {
    if (deleteTaskId) {
      try {
        setIsDeleting(true);
        setError(null);
        await taskService.deleteTask(deleteTaskId);
        onDeleteTask(deleteTaskId);
        setDeleteTaskId(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Errore durante l\'eliminazione del task');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditClose = () => {
    setEditingTask(null);
  };

  const handleEditSave = async (updatedTask: Partial<Task>) => {
    if (editingTask?._id) {
      try {
        const updated = await taskService.updateTask(editingTask._id, updatedTask);
        onUpdateTask(editingTask._id, updated);
        setEditingTask(null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {[
                'Tipo Servizio',
                'Dati Mezzo',
                'Cliente',
                'Priorità',
                'Stato',
                'Orario Inizio',
                'Orario Fine',
                'Note Ufficio',
                'Note Magazzino',
                'Azioni'
              ].map(header => (
                <TableCell key={header} sx={tableHeaderStyle}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id} hover>
                <TableCell>
                  <Chip
                    label={task.serviceType}
                    color={SERVICE_TYPE_COLORS[task.serviceType]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{task.vehicleData || '-'}</TableCell>
                <TableCell>
                  {task.clients.map((client, index) => (
                    <Chip
                      key={index}
                      label={client}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.priority}
                    color={PRIORITY_COLORS[task.priority]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{task.startTime || '-'}</TableCell>
                <TableCell>{task.endTime || '-'}</TableCell>
                <TableCell>{task.officeNotes || '-'}</TableCell>
                <TableCell>{task.warehouseNotes || '-'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(task)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(task._id)}
                    disabled={isDeleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!deleteTaskId}
        title="Conferma eliminazione"
        message={error || "Sei sicuro di voler eliminare questo task?"}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteTaskId(null);
          setError(null);
        }}
        error={!!error}
      />

      {editingTask && (
        <EditTaskModal
          open={!!editingTask}
          task={editingTask}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </>
  );
};

export default TaskTable;
