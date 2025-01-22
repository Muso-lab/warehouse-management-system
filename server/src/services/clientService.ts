import api from './api';

export const clientService = {
  getAllClients: async (): Promise<string[]> => {
    const response = await api.get('/clients');
    return response.data;
  },

  addClient: async (name: string): Promise<{ name: string }> => {
    const response = await api.post('/clients', { name });
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  }
};
