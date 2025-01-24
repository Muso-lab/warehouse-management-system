import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Questa è la base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor per aggiungere il token di autenticazione
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor per gestire gli errori
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export default api;
