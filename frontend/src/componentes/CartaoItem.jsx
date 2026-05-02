// CartaoItem — Card de item perdido/encontrado

import { MapPin, Calendar, Tag } from 'lucide-react';

const CATEGORIAS_LABELS = {
  ELETRONICO: '📱 Eletrônico',
  ROUPA: '👕 Roupa',
  MATERIAL_ESCOLAR: '📚 Material',
  ACESSORIO: '💍 Acessório',
  DOCUMENTO: '📄 Documento',
  CHAVE: '🔑 Chave',
  GARRAFA: '🧴 Garrafa',
  OUTRO: '📦 Outro',
};

export default function CartaoItem({ item, onClick }) {
  const ehPerdido = item.tipo === 'PERDIDO';

  return (
    <div
      onClick={() => onClick?.(item)}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
    >
      {/* Imagem */}
      <div className="relative h-44 overflow-hidden bg-slate-50">
        {item.imagem ? (
          <img
            src={item.imagem}
            alt={item.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-slate-50">
            <span className="text-5xl">{ehPerdido ? '🔍' : '✅'}</span>
          </div>
        )}

        {/* Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          ehPerdido
            ? 'bg-rose-500 text-white'
            : 'bg-emerald-500 text-white'
        }`}>
          {ehPerdido ? 'Perdido' : 'Encontrado'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-base text-slate-800 mb-1 truncate group-hover:text-primary-600 transition-colors">
          {item.titulo}
        </h3>
        <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">
          {item.descricao}
        </p>

        {/* Meta tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary-50 text-primary-600 text-[10px] font-semibold">
            <Tag size={10} />
            {CATEGORIAS_LABELS[item.categoria] || item.categoria}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-[10px] font-semibold">
            <MapPin size={10} />
            <span className="truncate max-w-[80px]">{item.local}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-[10px] font-semibold">
            <Calendar size={10} />
            {new Date(item.criadoEm || item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        </div>

        {/* Author */}
        {item.usuario && (
          <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-[9px] font-bold text-white">
              {item.usuario.nome?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-xs text-slate-400 font-medium">{item.usuario.nome}</span>
          </div>
        )}
      </div>
    </div>
  );
}
