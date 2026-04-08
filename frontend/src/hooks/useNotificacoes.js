// Hook de Notificações — recebe notificações em tempo real

import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api';
import { obterSocket } from '../servicos/socket';

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [naoLidas, setNaoLidas] = useState(0);

  // Carregar notificações do servidor
  const carregarNotificacoes = useCallback(async () => {
    try {
      const res = await api.get('/notificacoes');
      setNotificacoes(res.data.notificacoes);
      setNaoLidas(res.data.naoLidas);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  }, []);

  // Escutar notificações em tempo real
  useEffect(() => {
    carregarNotificacoes();

    const socket = obterSocket();
    if (socket) {
      socket.on('nova_notificacao', (notificacao) => {
        setNotificacoes(prev => [notificacao, ...prev]);
        setNaoLidas(prev => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off('nova_notificacao');
      }
    };
  }, [carregarNotificacoes]);

  // Marcar como lida
  const marcarComoLida = async (id) => {
    try {
      await api.put(`/notificacoes/${id}/lida`);
      setNotificacoes(prev =>
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      );
      setNaoLidas(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
    }
  };

  // Marcar todas como lidas
  const marcarTodasComoLidas = async () => {
    try {
      await api.put('/notificacoes/todas-lidas');
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
      setNaoLidas(0);
    } catch (err) {
      console.error('Erro ao marcar todas:', err);
    }
  };

  return { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas, recarregar: carregarNotificacoes };
}

export default useNotificacoes;
