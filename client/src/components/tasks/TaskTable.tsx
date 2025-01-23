import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  IconButton,
  Box,
  Button
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { Task, SERVICE_TYPE_COLORS, PRIORITY_COLORS } from '../../types/task';
import ConfirmDialog from '../common/ConfirmDialog';
import EditTaskModal from './EditTaskModal';
import WarehouseTaskModal from '../warehouse/WarehouseTaskModal';
import TableHeader from './TableHeader';
import FilterPopover from './FilterPopover';
import { useTaskTable } from '../../hooks/useTaskTable';
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
  userRole?: 'office' | 'magazzino' | 'admin' | 'monitor';
}

const TaskTable = ({ tasks, onDeleteTask, onUpdateTask, userRole = 'office' }: TaskTableProps) => {
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<string>('');

  const {
    sortConfig,
    filters,
    handleSort,
    handleFilterChange,
    clearFilter,
    clearAllFilters,
    getFilteredAndSortedTasks
  } = useTaskTable(tasks);

  const handleDeleteClick = (taskId: string) => {
    if (userRole === 'magazzino') return;
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

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, column: string) => {
    setCurrentFilterColumn(column);
    setFilterAnchorEl(event.currentTarget);
  };

  const renderActions = (task: Task) => {
    if (userRole === 'magazzino') {
      return (
        <IconButton
          color="primary"
          onClick={() => handleEditClick(task)}
        >
          <EditIcon />
        </IconButton>
      );
    }

    if (userRole === 'monitor') {
      return null;
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          startIcon={<ClearIcon />}
          onClick={clearAllFilters}
          disabled={Object.values(filters).every(v =>
            Array.isArray(v) ? v.length === 0 : v === ''
          )}
        >
          Pulisci tutti i filtri
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHeader
            onSort={handleSort}
            onFilterClick={handleFilterClick}
            sortConfig={sortConfig}
            filters={filters}
            tableHeaderStyle={tableHeaderStyle}
          />
          <TableBody>
            {getFilteredAndSortedTasks().map((task) => (
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
                  {renderActions(task)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FilterPopover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        currentFilterColumn={currentFilterColumn}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilter={clearFilter}
      />

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

      {editingTask && userRole === 'magazzino' ? (
        <WarehouseTaskModal
          open={!!editingTask}
          task={editingTask}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      ) : (
        editingTask && (
          <EditTaskModal
            open={!!editingTask}
            task={editingTask}
            onClose={handleEditClose}
            onSave={handleEditSave}
          />
        )
      )}
    </>
  );
};

export default TaskTable;
