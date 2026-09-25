import axios from 'axios';

// Apunta directo al puerto expuesto por el API Gateway
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Inyecta automáticamente el token Bearer si existe en el navegador
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;