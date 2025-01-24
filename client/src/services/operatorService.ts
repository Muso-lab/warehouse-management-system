import api from './api';
import { Operator } from '../types/operator';

export const operatorService = {
  getAllOperators: async (): Promise<Operator[]> => {
    try {
      const response = await api.get('/operators');
      return response.data;
    } catch (error) {
      console.error('Error fetching operators:', error);
      throw error;
    }
  },

  createOperator: async (operatorData: Omit<Operator, '_id'>): Promise<Operator> => {
    try {
      const response = await api.post('/operators', operatorData);
      return response.data;
    } catch (error) {
      console.error('Error creating operator:', error);
      throw error;
    }
  },

  updateOperator: async (id: string, operatorData: Partial<Operator>): Promise<Operator> => {
    try {
      const response = await api.put(`/operators/${id}`, operatorData);
      return response.data;
    } catch (error) {
      console.error('Error updating operator:', error);
      throw error;
    }
  },

  deleteOperator: async (id: string): Promise<void> => {
    try {
      await api.delete(`/operators/${id}`);
    } catch (error) {
      console.error('Error deleting operator:', error);
      throw error;
    }
  }
};
