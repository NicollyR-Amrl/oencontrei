// Serviço API — Instância do Axios com interceptors

import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const BASE_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('encontrei_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('encontrei_token');
      localStorage.removeItem('encontrei_usuario');
      // Redirecionar para login se não autenticado
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
