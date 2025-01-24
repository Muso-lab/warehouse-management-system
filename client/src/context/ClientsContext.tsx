import React, { createContext, useContext, useState, useEffect } from 'react';
import { clientService } from '../services/clientService';

interface ClientsContextType {
  clients: string[];
  updateClients: (newClients: string[]) => void;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<string[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const loadedClients = await clientService.getAllClients();
      console.log('Loaded clients:', loadedClients);
      setClients(loadedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const updateClients = (newClients: string[]) => {
    setClients(newClients);
  };

  return (
    <ClientsContext.Provider value={{ clients, updateClients }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};
