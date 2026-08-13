// Hook de Autenticação — Context + Provider

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../servicos/api';
import { conectarSocket, desconectarSocket } from '../servicos/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('encontrei_token'));

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const verificarAuth = async () => {
      const tokenSalvo = localStorage.getItem('encontrei_token');
      if (tokenSalvo) {
        try {
          const res = await api.get('/autenticacao/perfil');
          setUsuario(res.data.usuario);
          setToken(tokenSalvo);
          conectarSocket(tokenSalvo);
        } catch (err) {
          console.error('Token inválido, fazendo logout');
          logout();
        }
      }
      setCarregando(false);
    };
    verificarAuth();
  }, []);

  const login = async (email, senha) => {
    const res = await api.post('/autenticacao/login', { email, senha });
    const { token: novoToken, usuario: dadosUsuario } = res.data;

    localStorage.setItem('encontrei_token', novoToken);
    localStorage.setItem('encontrei_usuario', JSON.stringify(dadosUsuario));
    setToken(novoToken);
    setUsuario(dadosUsuario);
    conectarSocket(novoToken);

    return res.data;
  };

  const registrar = async (dados) => {
    const res = await api.post('/autenticacao/registrar', dados);
    const { token: novoToken, usuario: dadosUsuario } = res.data;

    localStorage.setItem('encontrei_token', novoToken);
    localStorage.setItem('encontrei_usuario', JSON.stringify(dadosUsuario));
    setToken(novoToken);
    setUsuario(dadosUsuario);
    conectarSocket(novoToken);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('encontrei_token');
    localStorage.removeItem('encontrei_usuario');
    setToken(null);
    setUsuario(null);
    desconectarSocket();
  };

  const atualizarUsuario = (dadosAtualizados) => {
    setUsuario(prev => ({ ...prev, ...dadosAtualizados }));
  };

  const aceitarTermos = async () => {
    try {
      const res = await api.post('/autenticacao/termos');
      if (res.data.sucesso) {
        setUsuario(prev => {
          const novoUsuario = { ...prev, termosAceitos: true };
          localStorage.setItem('encontrei_usuario', JSON.stringify(novoUsuario));
          return novoUsuario;
        });
        return true;
      }
    } catch (error) {
      console.error('Erro ao aceitar os termos:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      carregando,
      login,
      registrar,
      logout,
      atualizarUsuario,
      aceitarTermos,
      autenticado: !!usuario
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

export default useAuth;
