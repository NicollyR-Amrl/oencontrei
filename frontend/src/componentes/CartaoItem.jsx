// CartaoItem — Card de item perdido/encontrado (Design Limpo e Espaçoso)

import { MapPin, Calendar, Tag, ChevronRight, User } from 'lucide-react';

const CATEGORIAS_LABELS = {
  ELETRONICO: { label: 'Eletrônico', emoji: '📱' },
  ROUPA: { label: 'Roupa', emoji: '👕' },
  MATERIAL_ESCOLAR: { label: 'Material', emoji: '📚' },
  ACESSORIO: { label: 'Acessório', emoji: '💍' },
  DOCUMENTO: { label: 'Documento', emoji: '📄' },
  CHAVE: { label: 'Chave', emoji: '🔑' },
  GARRAFA: { label: 'Garrafa', emoji: '🧴' },
  OUTRO: { label: 'Outro', emoji: '📦' },
};

export default function CartaoItem({ item, onClick }) {
  const ehPerdido = item.tipo === 'PERDIDO';
  const infoCat = CATEGORIAS_LABELS[item.categoria] || { label: item.categoria || 'Outro', emoji: '📦' };

  return (
    <div
      onClick={() => onClick?.(item)}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-slate-300/40 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Top Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
        {item.imagem ? (
          <img
            src={item.imagem}
            alt={item.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/50 text-slate-400">
            <span className="text-4xl mb-1">{infoCat.emoji}</span>
            <span className="text-xs font-medium text-slate-400">Sem imagem</span>
          </div>
        )}

        {/* Status Badge (Perdido / Encontrado) */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
            ehPerdido
              ? 'bg-rose-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            {ehPerdido ? 'Perdido' : 'Encontrado'}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm border border-white/40">
            <span>{infoCat.emoji}</span>
            <span>{infoCat.label}</span>
          </span>
        </div>
      </div>

      {/* Card Content with generous padding and line-height */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base md:text-lg leading-snug mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.titulo}
          </h3>
          
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {item.descricao}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Location tag */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <span className="truncate">{item.local}</span>
          </div>

          {/* User info footer */}
          {item.usuario && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {item.usuario.nome?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-600 truncate">{item.usuario.nome}</span>
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5 shrink-0 group-hover:translate-x-1 transition-transform">
                Ver detalhes <ChevronRight size={14} />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
