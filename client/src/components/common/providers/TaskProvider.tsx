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
  currentTask: Task | null;
  setSelectedDate: (date: Date) => void;
  loadTasks: () => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTaskById: (taskId: string) => Promise<void>;
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
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

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
      await loadTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Errore durante l\'aggiornamento del task');
    } finally {
      setLoading(false);
    }
  };

  // Nuova funzione per creare un task
  const createTask = async (task: Partial<Task>) => {
    try {
      setLoading(true);
      await taskService.createTask(task);
      setSuccessMessage('Task creato con successo');
      await loadTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Errore durante la creazione del task');
    } finally {
      setLoading(false);
    }
  };

  // Nuova funzione per eliminare un task
  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await taskService.deleteTask(taskId);
      setSuccessMessage('Task eliminato con successo');
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Errore durante l\'eliminazione del task');
    } finally {
      setLoading(false);
    }
  };

  // Nuova funzione per ottenere un task specifico
  const getTaskById = async (taskId: string) => {
    try {
      setLoading(true);
      const task = await taskService.getTaskById(taskId);
      setCurrentTask(task);
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('Errore nel recupero del task');
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
    currentTask,
    setSelectedDate,
    loadTasks,
    updateTask,
    createTask,
    deleteTask,
    getTaskById,
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
