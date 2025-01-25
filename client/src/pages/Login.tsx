// client/src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { authService } from '../services/authService';
import { User } from '../types/user';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login = ({ setUser }: LoginProps) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { user, token } = await authService.login(
        credentials.username,
        credentials.password
      );

      console.log('Login successful:', {
        username: user.username,
        role: user.role,
        active: user.active
      }); // Debug log

      authService.setUserSession(user, token);
      setUser(user);

      // Reindirizza in base al ruolo
      switch (user.role) {
        case 'admin':
          console.log('Redirecting admin to dashboard');
          navigate('/dashboard');
          break;
        case 'magazzino':
          navigate('/dashboard');
          break;
        case 'monitor':
          navigate('/monitor');
          break;
        case 'ufficio':
          navigate('/dashboard');
          break;
        default:
          console.error('Ruolo non riconosciuto:', user.role);
          setError('Ruolo utente non valido');
          return;
      }

    } catch (err) {
      setError('Username o password non validi');
      console.error('Login error:', err);
      setCredentials({ username: '', password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            LL Warehouse Task Management
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              disabled={isLoading}
              value={credentials.username}
              onChange={(e) => setCredentials({
                ...credentials,
                username: e.target.value
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={isLoading}
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Accedi'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
