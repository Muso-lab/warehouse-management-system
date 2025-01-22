export interface User {
  id: string;
  username: string;
  role: 'admin' | 'office' | 'warehouse' | 'monitor';
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
