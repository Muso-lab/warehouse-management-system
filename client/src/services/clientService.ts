import api from './api';

export const clientService = {
  getAllClients: async (): Promise<string[]> => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  addClient: async (name: string): Promise<{ name: string }> => {
    try {
      const response = await api.post('/clients', { name });
      return response.data;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  },

  deleteClient: async (name: string): Promise<void> => {
    try {
      await api.delete(`/clients/${name}`);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};
