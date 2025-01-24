// client/src/services/authService.ts
import { User } from '../types/user';

const API_URL = '/api/auth';

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<{user: User; token: string}> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();
      console.log('Raw API Response:', data); // Debug

      // Se la risposta non è ok o success è false
      if (!response.ok || !data.success) {
        console.error('Login failed:', data.message || response.statusText);
        throw new Error(data.message || 'Credenziali non valide');
      }

      // Verifica che data.data contenga user e token
      if (!data.data || !data.data.user || !data.data.token) {
        console.error('Invalid response format:', data);
        throw new Error('Formato risposta non valido');
      }

      // Verifica che l'utente abbia tutti i campi necessari
      const { user, token } = data.data;
      if (!user.username || !user.role || user.active === undefined) {
        console.error('Invalid user data:', user);
        throw new Error('Dati utente non validi');
      }

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      // Verifica che l'oggetto user sia valido
      if (!user.username || !user.role || user.active === undefined) {
        console.error('Invalid user data in localStorage:', user);
        this.logout(); // Pulisci i dati non validi
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.logout(); // Pulisci in caso di errore
      return null;
    }
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  setUserSession: (user: User, token: string) => {
    try {
      // Verifica che l'utente abbia i campi necessari
      if (!user.username || !user.role || user.active === undefined) {
        throw new Error('Dati utente non validi');
      }

      // Rimuovi la password prima di salvare nel localStorage
      const userToStore = { ...user };
      delete userToStore.password;

      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('token', token);
      console.log('User session set successfully');
    } catch (error) {
      console.error('Error setting user session:', error);
      throw error;
    }
  },

  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem('token');
      const user = this.getCurrentUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
};
