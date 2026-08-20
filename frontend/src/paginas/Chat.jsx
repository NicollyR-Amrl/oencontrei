// Chat — Página de chat em tempo real + Assistente Qwen IA

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../servicos/api';
import { obterSocket } from '../servicos/socket';
import { useAuth } from '../hooks/useAuth';
import MensagemChat from '../componentes/MensagemChat';
import { Send, MessageCircle, ArrowLeft, Bot, Sparkles, Loader2 } from 'lucide-react';

const IA_BOT_CONTATO = {
  id: 'ia-bot',
  nome: 'EncontreiBot 🤖',
  avatar: null,
  isBot: true
};

export default function Chat() {
  const { usuarioId } = useParams();
  const { usuario } = useAuth();
  const [conversas, setConversas] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [contatoAtivo, setContatoAtivo] = useState(usuarioId || 'ia-bot');
  const [contatoInfo, setContatoInfo] = useState(usuarioId ? null : IA_BOT_CONTATO);
  const [digitando, setDigitando] = useState(false);
  const [enviandoIA, setEnviandoIA] = useState(false);
  const mensagensRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    carregarConversas();
  }, []);

  useEffect(() => {
    if (contatoAtivo === 'ia-bot') {
      setContatoInfo(IA_BOT_CONTATO);
      setMensagens([
        {
          id: 'bot-welcome',
          conteudo: 'Olá! Sou o EncontreiBot 🤖, assistente inteligente movido por IA Nemotron 3.5. Posso te ajudar a encontrar objetos perdidos ou tirar dúvidas sobre o sistema. Como posso te ajudar hoje?',
          remetenteId: 'ia-bot',
          remetente: { id: 'ia-bot', nome: 'EncontreiBot 🤖' },
          criadoEm: new Date().toISOString()
        }
      ]);
    } else if (contatoAtivo) {
      carregarMensagens(contatoAtivo);
    }
  }, [contatoAtivo]);

  useEffect(() => {
    const socket = obterSocket();
    if (!socket) return;

    const handleNovaMensagem = (mensagem) => {
      if (contatoAtivo !== 'ia-bot' && (mensagem.remetenteId === contatoAtivo || mensagem.remetente?.id === contatoAtivo)) {
        setMensagens(prev => [...prev, mensagem]);
        scrollParaBaixo();
      }
      carregarConversas();
    };

    socket.on('nova_mensagem', handleNovaMensagem);
    socket.on('mensagem_enviada', (msg) => {
      if (contatoAtivo !== 'ia-bot') {
        setMensagens(prev => [...prev, msg]);
        scrollParaBaixo();
      }
    });

    return () => {
      socket.off('nova_mensagem', handleNovaMensagem);
      socket.off('mensagem_enviada');
    };
  }, [contatoAtivo]);

  const carregarConversas = async () => {
    try {
      const res = await api.get('/chat/conversas');
      setConversas(res.data.conversas || []);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
    }
  };

  const carregarMensagens = async (id) => {
    try {
      const res = await api.get(`/chat/mensagens/${id}`);
      setMensagens(res.data.mensagens);
      const conversa = conversas.find(c => c.usuario.id === id);
      if (conversa) setContatoInfo(conversa.usuario);
      setTimeout(scrollParaBaixo, 100);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto || !contatoAtivo) return;

    setNovaMensagem('');

    if (contatoAtivo === 'ia-bot') {
      const mensagemUser = {
        id: `user-${Date.now()}`,
        conteudo: texto,
        remetenteId: usuario.id,
        remetente: { id: usuario.id, nome: usuario.nome },
        criadoEm: new Date().toISOString()
      };
      setMensagens(prev => [...prev, mensagemUser]);
      setEnviandoIA(true);
      setTimeout(scrollParaBaixo, 50);

      try {
        const res = await api.post('/ia/chat', { mensagem: texto });
        const mensagemBot = {
          id: `bot-${Date.now()}`,
          conteudo: res.data.resposta || 'Não consegui processar a resposta.',
          remetenteId: 'ia-bot',
          remetente: { id: 'ia-bot', nome: 'EncontreiBot 🤖' },
          criadoEm: new Date().toISOString()
        };
        setMensagens(prev => [...prev, mensagemBot]);
        setTimeout(scrollParaBaixo, 100);
      } catch (err) {
        console.error('Erro ao falar com IA:', err);
      } finally {
        setEnviandoIA(false);
      }
      return;
    }

    const socket = obterSocket();
    if (socket) {
      socket.emit('enviar_mensagem', {
        destinatarioId: contatoAtivo,
        conteudo: texto
      });
    }
    inputRef.current?.focus();
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
      <div className={`${contatoAtivo ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 bg-white rounded-2xl overflow-hidden border border-borda shadow-sm`}>
        <div className="p-4 border-b border-borda flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageCircle size={20} className="text-primary-500" /> Conversas
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 p-2">
          {/* Item Fixo: EncontreiBot IA */}
          <button
            onClick={() => setContatoAtivo('ia-bot')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
              contatoAtivo === 'ia-bot' 
                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-md' 
                : 'bg-violet-50 hover:bg-violet-100 text-slate-800 border border-violet-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
              contatoAtivo === 'ia-bot' ? 'bg-white/20 text-white' : 'bg-violet-600 text-white'
            }`}>
              <Bot size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-bold text-sm truncate flex items-center gap-1">
                  EncontreiBot <Sparkles size={12} className={contatoAtivo === 'ia-bot' ? 'text-amber-300' : 'text-violet-600'} />
                </p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  contatoAtivo === 'ia-bot' ? 'bg-white/20 text-white' : 'bg-violet-200 text-violet-800'
                }`}>IA</span>
              </div>
              <p className={`text-xs truncate ${contatoAtivo === 'ia-bot' ? 'text-violet-100' : 'text-slate-500'}`}>
                Assistente Virtual Qwen
              </p>
            </div>
          </button>

          <div className="my-2 border-t border-slate-100 px-2 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Usuários
          </div>

          {conversas.length === 0 ? (
            <div className="text-center py-6 text-texto-secundario text-xs">
              Nenhuma outra conversa ainda
            </div>
          ) : (
            conversas.map(conversa => (
              <button
                key={conversa.usuario.id}
                onClick={() => setContatoAtivo(conversa.usuario.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  contatoAtivo === conversa.usuario.id ? 'bg-primary-50 border-l-4 border-primary-500 font-medium' : 'hover:bg-slate-50'
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
      <div className={`${!contatoAtivo ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white rounded-2xl overflow-hidden border border-borda shadow-sm`}>
        {contatoAtivo ? (
          <>
            {/* Header do chat */}
            <div className="flex items-center gap-3 p-4 border-b border-borda bg-primary-50/50">
              <button
                onClick={() => setContatoAtivo(null)}
                className="md:hidden text-texto-secundario hover:text-primary-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              {contatoAtivo === 'ia-bot' ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  <Bot size={22} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white">
                  {contatoInfo?.nome?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div>
                <p className="font-bold flex items-center gap-2">
                  {contatoInfo?.nome || 'Usuário'}
                  {contatoAtivo === 'ia-bot' && (
                    <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> IA Nemotron 3.5
                    </span>
                  )}
                </p>
                {digitando && contatoAtivo !== 'ia-bot' && (
                  <p className="text-xs text-primary-500 animate-pulse">digitando...</p>
                )}
                {contatoAtivo === 'ia-bot' && (
                  <p className="text-xs text-slate-400">Online • Tira dúvidas e busca objetos</p>
                )}
              </div>
            </div>

            {/* Mensagens */}
            <div ref={mensagensRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-primary-50/20 to-white">
              {mensagens.map(msg => (
                <MensagemChat key={msg.id} mensagem={msg} />
              ))}
              {enviandoIA && (
                <div className="flex items-center gap-2 text-violet-600 text-xs font-semibold p-2 bg-violet-50 rounded-xl w-fit animate-pulse">
                  <Loader2 size={14} className="animate-spin" />
                  <span>EncontreiBot está pensando...</span>
                </div>
              )}
            </div>

            {/* Input de mensagem */}
            <form onSubmit={enviarMensagem} className="p-4 border-t border-borda bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder={contatoAtivo === 'ia-bot' ? 'Pergunte à IA sobre algum item ou dúvida...' : 'Digite uma mensagem...'}
                  className="input-field flex-1"
                />
                <button
                  type="submit"
                  disabled={!novaMensagem.trim() || enviandoIA}
                  className="btn-primary px-4 disabled:opacity-30 flex items-center justify-center gap-1"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-texto-secundario">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 text-primary-200" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
