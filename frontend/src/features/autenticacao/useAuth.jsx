import { create } from 'zustand';
import api from '../../shared/servicos/api';
import { conectarSocket, desconectarSocket } from '../../shared/servicos/socket';

export const useAuth = create((set, get) => ({
  usuario: null,
  token: localStorage.getItem('encontrei_token'),
  carregando: true,
  autenticado: false,

  verificarAuth: async () => {
    const tokenSalvo = localStorage.getItem('encontrei_token');
    if (tokenSalvo) {
      try {
        const res = await api.get('/autenticacao/perfil');
        set({ 
            usuario: res.data.usuario,
            token: tokenSalvo,
            autenticado: true 
        });
        conectarSocket(tokenSalvo);
      } catch (err) {
        console.error('Token inválido, fazendo logout');
        get().logout();
      }
    }
    set({ carregando: false });
  },

  login: async (email, senha) => {
    const res = await api.post('/autenticacao/login', { email, senha });
    const { token: novoToken, usuario: dadosUsuario } = res.data;

    localStorage.setItem('encontrei_token', novoToken);
    localStorage.setItem('encontrei_usuario', JSON.stringify(dadosUsuario));
    set({
        token: novoToken,
        usuario: dadosUsuario,
        autenticado: true
    });
    
    try { conectarSocket(novoToken); } catch (e) { console.warn('Socket indisponível:', e); }
    return res.data;
  },

  registrar: async (dados) => {
    // Se dados for FormData, envia com os headers corretos
    const config = dados instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};

    const res = await api.post('/autenticacao/registrar', dados, config);
    const { token: novoToken, usuario: dadosUsuario } = res.data;

    localStorage.setItem('encontrei_token', novoToken);
    localStorage.setItem('encontrei_usuario', JSON.stringify(dadosUsuario));
    set({
        token: novoToken,
        usuario: dadosUsuario,
        autenticado: true
    });
    
    try { conectarSocket(novoToken); } catch (e) { console.warn('Socket indisponível:', e); }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('encontrei_token');
    localStorage.removeItem('encontrei_usuario');
    set({
        token: null,
        usuario: null,
        autenticado: false
    });
    desconectarSocket();
  },

  atualizarUsuario: (dadosAtualizados) => {
    set((state) => ({ usuario: { ...state.usuario, ...dadosAtualizados } }));
  }
}));

export default useAuth;
