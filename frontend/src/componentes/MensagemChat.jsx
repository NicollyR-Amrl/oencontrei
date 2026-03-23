// MensagemChat — Bolha de mensagem no chat

import { useAuth } from '../hooks/useAuth';

export default function MensagemChat({ mensagem }) {
  const { usuario } = useAuth();
  const ehMinha = mensagem.remetenteId === usuario?.id || mensagem.remetente?.id === usuario?.id;

  return (
    <div className={`flex ${ehMinha ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
      <div className={`max-w-[75%] md:max-w-[60%] ${
        ehMinha
          ? 'gradient-primary rounded-2xl rounded-br-md text-white'
          : 'bg-fundo-card border border-borda rounded-2xl rounded-bl-md'
      } px-4 py-3`}>
        {/* Nome do remetente (se não for minha) */}
        {!ehMinha && mensagem.remetente && (
          <p className="text-xs text-primary-400 font-semibold mb-1">
            {mensagem.remetente.nome}
          </p>
        )}

        {/* Conteúdo */}
        <p className="text-sm leading-relaxed break-words">{mensagem.conteudo}</p>

        {/* Timestamp */}
        <p className={`text-[10px] mt-1 ${
          ehMinha ? 'text-white/60' : 'text-texto-secundario'
        } text-right`}>
          {new Date(mensagem.criadoEm).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}
