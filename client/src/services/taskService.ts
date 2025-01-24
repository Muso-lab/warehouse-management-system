import api from './api';
import { Task } from '../types/task';

export const taskService = {
  getTasksByDate: async (date: string) => {
    try {
      console.log('Frontend - Requesting tasks for date:', date);
      // Rimuoviamo '/api' dall'URL poiché è già nella baseURL
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
      // Modifica qui: rimuovi /api dall'URL perché è già nella baseURL
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('TaskService - Full error:', error);
      throw error;
    }
  },

  updateTask: async (taskId: string, taskData: Partial<Task>) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
  },

  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  }
};
