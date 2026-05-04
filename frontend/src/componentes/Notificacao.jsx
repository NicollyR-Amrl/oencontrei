// Notificacao — Item de notificação na lista

import { Bell, Handshake, MessageCircle, Info } from 'lucide-react';

const ICONES_TIPO = {
  match: Handshake,
  mensagem: MessageCircle,
  sistema: Info,
};

export default function Notificacao({ notificacao, onMarcarLida }) {
  const Icone = ICONES_TIPO[notificacao.tipo] || Bell;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl transition-all cursor-pointer ${
        notificacao.lida
          ? 'bg-primary-50/30 opacity-60'
          : 'bg-white border border-primary-100 hover:border-primary-300 shadow-sm'
      }`}
      onClick={() => !notificacao.lida && onMarcarLida?.(notificacao.id)}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        notificacao.lida ? 'bg-primary-100' : 'gradient-primary'
      }`}>
        <Icone size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-texto-primario">{notificacao.titulo}</p>
        <p className="text-xs text-texto-secundario mt-0.5 truncate">{notificacao.mensagem}</p>
        <p className="text-[10px] text-texto-secundario mt-1">
          {new Date(notificacao.criadoEm).toLocaleString('pt-BR')}
        </p>
      </div>
      {!notificacao.lida && (
        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shrink-0 mt-1 animate-pulse"></div>
      )}
    </div>
  );
}
