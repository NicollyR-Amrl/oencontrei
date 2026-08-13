// Serviço API — Instância do Axios com interceptors

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: adicionar token JWT e tratar FormData automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('encontrei_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Se for FormData, remove o Content-Type padrão para o Axios definir multipart/form-data com boundary
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
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
