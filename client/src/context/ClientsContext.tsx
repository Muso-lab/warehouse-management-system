import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clientService } from '../services/clientService';

interface ClientsContextType {
  clients: string[];
  updateClients: (newClients: string[]) => void;
  isLoading: boolean;
  error: string | null;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedClients = await clientService.getAllClients();
      setClients(loadedClients);
    } catch (err) {
      setError('Errore nel caricamento dei clienti');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateClients = (newClients: string[]) => {
    setClients(newClients);
  };

  return (
    <ClientsContext.Provider value={{
      clients,
      updateClients,
      isLoading,
      error
    }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};
