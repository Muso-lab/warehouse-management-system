// client/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Cambiato da http://localhost:5000/api
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
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers
  });
  return config;
});

// Interceptor per gestire gli errori
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      config: error.config
    });
    throw error;
  }
);

export default api;
