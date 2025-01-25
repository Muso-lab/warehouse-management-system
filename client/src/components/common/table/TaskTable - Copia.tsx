// client/src/components/common/table/TaskTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { Task } from '../../../types/task';
import { tableStyles } from '../../../styles/tableStyles';
import { ColumnConfig } from './types';
import EnhancedTableHeaderCell from './EnhancedTableHeaderCell';

interface TaskTableProps {
  tasks: Task[];
  loading?: boolean;
  columns: ColumnConfig[];
  renderRow: (task: Task) => React.ReactNode;
  initialSort?: { field: string; order: 'asc' | 'desc' };
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading = false,
  columns,
  renderRow,
  initialSort = { field: 'startTime', order: 'asc' },
  onUpdateTask,
}) => {
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (columnId: string) => {
    setSortConfig(prev => ({
      field: columnId,
      order: prev.field === columnId && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (columnId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  // Filtraggio e ordinamento dei task
  const getFilteredAndSortedTasks = () => {
    return tasks
      .filter(task => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return task[key as keyof Task]?.toString() === value;
        });
      })
      .sort((a, b) => {
        const { field, order } = sortConfig;
        const aValue = a[field as keyof Task];
        const bValue = b[field as keyof Task];

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredAndSortedTasks = getFilteredAndSortedTasks();

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={tableStyles.tableContainer}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <EnhancedTableHeaderCell
                  key={column.id}
                  column={column}
                  sortDirection={sortConfig.field === column.id ? sortConfig.order : undefined}
                  sortActive={sortConfig.field === column.id}
                  filterValue={filters[column.id]}
                  onSort={() => handleSort(column.id)}
                  onFilterChange={(value) => handleFilter(column.id, value)}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map(renderRow)
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography sx={{ py: 2 }}>
                    NESSUN TASK PER QUESTA DATA
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TaskTable;
