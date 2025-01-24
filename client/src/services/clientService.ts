import api from './api';

export const clientService = {
  getAllClients: async () => {
      const response = await api.get('/clients');
      return response.data;
    },

    addClient: async (clientName: string) => {
      const response = await api.post('/clients', { name: clientName });
      return response.data;
    },

    deleteClient: async (clientName: string) => {
      await api.delete(`/clients/${clientName}`);
    }
  };
