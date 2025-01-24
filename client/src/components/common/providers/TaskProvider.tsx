// client/src/components/common/providers/TaskProvider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task } from '../../../types/task';
import { taskService } from '../../../services/taskService';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  loadTasks: () => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  clearSuccessMessage: () => void;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dateStr = selectedDate.toISOString().split('T')[0];
      console.log('Loading tasks for date:', dateStr);

      const fetchedTasks = await taskService.getTasksByDate(dateStr);
      console.log('Fetched tasks:', fetchedTasks);

      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Errore nel caricamento dei task');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      console.log('Updating task:', { taskId, updates });

      await taskService.updateTask(taskId, updates);
      setSuccessMessage('Task aggiornato con successo');
      await loadTasks(); // Ricarica i task dopo l'aggiornamento
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Errore durante l\'aggiornamento del task');
    } finally {
      setLoading(false);
    }
  };

  const clearSuccessMessage = () => setSuccessMessage(null);
  const clearError = () => setError(null);

  const value = {
    tasks,
    loading,
    error,
    successMessage,
    selectedDate,
    setSelectedDate,
    loadTasks,
    updateTask,
    clearSuccessMessage,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
