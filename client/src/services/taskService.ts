import api from './api';
import { Task } from '../types/task';

export const taskService = {
  getTasksByDate: async (date: string): Promise<Task[]> => {
    try {
      const response = await api.get(`/tasks/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error deleting task');
      }
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }
};
