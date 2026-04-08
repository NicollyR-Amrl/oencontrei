// Serviço Socket.io — Cliente de WebSocket

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

/**
 * Conectar ao servidor Socket.io
 */
export function conectarSocket(token) {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('🔌 Conectado ao Socket.io');
  });

  socket.on('disconnect', () => {
    console.log('❌ Desconectado do Socket.io');
  });

  socket.on('connect_error', (err) => {
    console.error('Erro de conexão Socket.io:', err.message);
  });

  return socket;
}

/**
 * Obter instância do socket
 */
export function obterSocket() {
  return socket;
}

/**
 * Desconectar do Socket.io
 */
export function desconectarSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
