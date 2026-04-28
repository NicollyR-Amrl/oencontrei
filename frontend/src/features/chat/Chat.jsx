// Chat — Página de chat em tempo real

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../shared/servicos/api';
import { obterSocket } from '../../shared/servicos/socket';
import { useAuth } from '../autenticacao/useAuth';
import MensagemChat from './MensagemChat';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';

export default function Chat() {
  const { usuarioId } = useParams();
  const { usuario } = useAuth();
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [contatoAtivo, setContatoAtivo] = useState(usuarioId || null);
  const [contatoInfo, setContatoInfo] = useState(null);
  const [digitando, setDigitando] = useState(false);
  const mensagensRef = useRef(null);
  const inputRef = useRef(null);

  // Carregar conversas
  useEffect(() => {
    carregarConversas();
  }, []);

  // Carregar mensagens quando contato muda
  useEffect(() => {
    if (contatoAtivo) {
      carregarMensagens(contatoAtivo);
    }
  }, [contatoAtivo]);

  // Escutar novas mensagens via Socket.io
  useEffect(() => {
    const socket = obterSocket();
    if (!socket) return;

    const handleNovaMensagem = (mensagem) => {
      if (
        mensagem.remetenteId === contatoAtivo ||
        mensagem.remetente?.id === contatoAtivo
      ) {
        setMensagens(prev => [...prev, mensagem]);
        scrollParaBaixo();
      }
      // Refresh conversas para atualizar última mensagem
      carregarConversas();
    };

    const handleDigitando = (dados) => {
      if (dados.usuarioId === contatoAtivo) {
        setDigitando(true);
        setTimeout(() => setDigitando(false), 3000);
      }
    };

    socket.on('nova_mensagem', handleNovaMensagem);
    socket.on('mensagem_enviada', (msg) => {
      setMensagens(prev => [...prev, msg]);
      scrollParaBaixo();
    });
    socket.on('usuario_digitando', handleDigitando);

    return () => {
      socket.off('nova_mensagem', handleNovaMensagem);
      socket.off('mensagem_enviada');
      socket.off('usuario_digitando', handleDigitando);
    };
  }, [contatoAtivo]);

  const carregarConversas = async () => {
    try {
      const res = await api.get('/chat/conversas');
      setConversas(res.data.conversas);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
    }
  };

  const carregarMensagens = async (id) => {
    try {
      const res = await api.get(`/chat/mensagens/${id}`);
      setMensagens(res.data.mensagens);

      // Encontrar info do contato
      const conversa = conversas.find(c => c.usuario.id === id);
      if (conversa) setContatoInfo(conversa.usuario);

      setTimeout(scrollParaBaixo, 100);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || !contatoAtivo) return;

    const socket = obterSocket();
    if (socket) {
      socket.emit('enviar_mensagem', {
        destinatarioId: contatoAtivo,
        conteudo: novaMensagem.trim()
      });
    }

    setNovaMensagem('');
    inputRef.current?.focus();
  };

  const handleDigitando = () => {
    const socket = obterSocket();
    if (socket && contatoAtivo) {
      socket.emit('digitando', { destinatarioId: contatoAtivo });
    }
  };

  const scrollParaBaixo = () => {
    mensagensRef.current?.scrollTo({
      top: mensagensRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4">
      {/* Lista de conversas */}
      <div className={`${contatoAtivo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 glass-strong rounded-2xl overflow-hidden`}>
        <div className="p-4 border-b border-borda">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageCircle size={20} className="text-primary-400" /> Conversas
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversas.length === 0 ? (
            <div className="text-center py-10 text-texto-secundario text-sm">
              Nenhuma conversa ainda
            </div>
          ) : (
            conversas.map(conversa => (
              <button
                key={conversa.usuario.id}
                onClick={() => setContatoAtivo(conversa.usuario.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-fundo-card-hover transition-all text-left ${
                  contatoAtivo === conversa.usuario.id ? 'bg-primary-500/10 border-l-2 border-primary-500' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {conversa.usuario.nome?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-sm truncate">{conversa.usuario.nome}</p>
                    {conversa.naoLidas > 0 && (
                      <span className="w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {conversa.naoLidas}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-texto-secundario truncate">
                    {conversa.ultimaMensagem?.conteudo}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área de chat */}
      <div className={`${!contatoAtivo ? 'hidden md:flex' : 'flex'} flex-1 flex-col glass-strong rounded-2xl overflow-hidden`}>
        {contatoAtivo ? (
          <>
            {/* Header do chat */}
            <div className="flex items-center gap-3 p-4 border-b border-borda">
              <button
                onClick={() => setContatoAtivo(null)}
                className="md:hidden text-texto-secundario hover:text-primary-400 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white">
                {contatoInfo?.nome?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-semibold">{contatoInfo?.nome || 'Usuário'}</p>
                {digitando && (
                  <p className="text-xs text-primary-400 animate-pulse">digitando...</p>
                )}
              </div>
            </div>

            {/* Mensagens */}
            <div ref={mensagensRef} className="flex-1 overflow-y-auto p-4 space-y-1">
              {mensagens.length === 0 ? (
                <div className="text-center py-10 text-texto-secundario text-sm">
                  Nenhuma mensagem ainda. Diga olá! 👋
                </div>
              ) : (
                mensagens.map(msg => (
                  <MensagemChat key={msg.id} mensagem={msg} />
                ))
              )}
            </div>

            {/* Input de mensagem */}
            <form onSubmit={enviarMensagem} className="p-4 border-t border-borda">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => {
                    setNovaMensagem(e.target.value);
                    handleDigitando();
                  }}
                  placeholder="Digite uma mensagem..."
                  className="input-field flex-1"
                />
                <button
                  type="submit"
                  disabled={!novaMensagem.trim()}
                  className="btn-primary px-4 disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-texto-secundario">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
