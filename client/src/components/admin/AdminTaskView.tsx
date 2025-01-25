// src/components/admin/AdminTaskView.tsx

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useTask } from '../common/providers/TaskProvider';
import PageHeader from '../common/layout/PageHeader';
import TaskTable from '../common/table/TaskTable';
import { Task } from '../../types/task';

const AdminTaskView: React.FC = () => {
  const { tasks, loading, error, loadTasks, updateTask, deleteTask } = useTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  console.log('AdminTaskView - tasks:', tasks); // Debug log

  const handleUpdateTask = (taskId: string, task: Task) => {
    console.log('Update task:', taskId, task);
    // Qui implementeremo la logica di modifica, probabilmente aprendo un modal
    setSelectedTask(task);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo task?')) {
      try {
        await deleteTask(taskId);
        loadTasks(); // Ricarica i task dopo l'eliminazione
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleCreateTask = () => {
    // Qui implementeremo la logica di creazione, probabilmente aprendo un modal
    console.log('Create new task');
  };

  return (
    <>
        <PageHeader
          title="Gestione Task"
          subtitle="Gestione completa dei task"
          showDateSelector={false}  // Non mostriamo il selettore della data
        />
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Lista Task
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTask}
            >
              Nuovo Task
            </Button>
          </Box>
          <TaskTable
            tasks={tasks || []}
            loading={loading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </Paper>
      </Box>

      {/* Qui aggiungeremo i modal per create/edit */}
      {/* TODO: Implementare TaskFormModal */}
    </>
  );
};

export default AdminTaskView;
