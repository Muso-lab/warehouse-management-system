// client/src/services/taskService.ts
import api from './api';
import { Task } from '../types/task';

export const taskService = {
  // Aggiungiamo questo metodo
  getTasks: async () => {
    try {
      console.log('TaskService - Fetching all tasks');
      const response = await api.get('/tasks');
      console.log('TaskService - Received tasks:', response.data);
      return response.data;
    } catch (error) {
      console.error('TaskService - Error fetching tasks:', error);
      throw error;
    }
  },

  getTasksByDate: async (date: string) => {
    try {
      console.log('Frontend - Requesting tasks for date:', date);
      const response = await api.get(`/tasks/date/${date}`);
      console.log('Frontend - Received tasks:', response.data);
      return response.data;
    } catch (error) {
      console.error('Frontend - Error fetching tasks:', error);
      throw error;
    }
  },

  createTask: async (taskData: Omit<Task, '_id'>) => {
    try {
      console.log('TaskService - Creating task with data:', taskData);
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('TaskService - Full error:', error);
      throw error;
    }
  },

  updateTask: async (taskId: string, taskData: Partial<Task>) => {
    try {
      console.log('TaskService - Updating task:', { taskId, taskData });
      const response = await api.put(`/tasks/${taskId}`, taskData);
      console.log('TaskService - Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('TaskService - Update error:', error);
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      console.log('TaskService - Deleting task:', taskId);
      await api.delete(`/tasks/${taskId}`);
      console.log('TaskService - Delete successful');
    } catch (error) {
      console.error('TaskService - Delete error:', error);
      throw error;
    }
  },

  getTaskStats: async () => {
    try {
      console.log('TaskService - Fetching stats');
      const response = await api.get('/tasks/stats');
      console.log('TaskService - Stats received:', response.data);
      return response.data;
    } catch (error) {
      console.error('TaskService - Stats error:', error);
      throw error;
    }
  }
};
