import { create } from 'zustand';
import api from '../../shared/servicos/api';
import { obterSocket } from '../../shared/servicos/socket';

export const useNotificacoes = create((set, get) => ({
  notificacoes: [],
  naoLidas: 0,
  _socketAtivo: false,

  carregarNotificacoes: async () => {
    try {
      const res = await api.get('/notificacoes');
      set({ 
        notificacoes: res.data.notificacoes,
        naoLidas: res.data.naoLidas
      });
      get().iniciarSocket();
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  },

  iniciarSocket: () => {
    if (get()._socketAtivo) return;
    
    const socket = obterSocket();
    if (socket) {
      socket.on('nova_notificacao', (notificacao) => {
        set((state) => ({
          notificacoes: [notificacao, ...state.notificacoes],
          naoLidas: state.naoLidas + 1
        }));
      });
      set({ _socketAtivo: true });
    }
  },

  marcarComoLida: async (id) => {
    try {
      await api.put(`/notificacoes/${id}/lida`);
      set((state) => ({
        notificacoes: state.notificacoes.map(n => n.id === id ? { ...n, lida: true } : n),
        naoLidas: Math.max(0, state.naoLidas - 1)
      }));
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
    }
  },

  marcarTodasComoLidas: async () => {
    try {
      await api.put('/notificacoes/todas-lidas');
      set((state) => ({
        notificacoes: state.notificacoes.map(n => ({ ...n, lida: true })),
        naoLidas: 0
      }));
    } catch (err) {
      console.error('Erro ao marcar todas:', err);
    }
  },
  
  recarregar: () => get().carregarNotificacoes()
}));

export default useNotificacoes;
