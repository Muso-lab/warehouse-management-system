import api from './api';
import { Task } from '../types/task';

export const taskService = {
  getTasksByDate: async (date: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/${date}`);
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};
