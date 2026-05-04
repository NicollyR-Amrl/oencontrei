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
      <div className="relative aspect-square md:h-44 md:aspect-auto overflow-hidden bg-slate-50">
        {item.imagem ? (
          <img
            src={item.imagem}
            alt={item.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-slate-50">
            <span className="text-3xl md:text-5xl">{ehPerdido ? '🔍' : '📦'}</span>
          </div>
        )}

        {/* Badge */}
        <div className={`absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          ehPerdido
            ? 'bg-rose-500 text-white'
            : 'bg-emerald-500 text-white'
        }`}>
          {ehPerdido ? 'Perdido' : 'Encontrado'}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-bold text-sm md:text-base text-slate-800 mb-0.5 md:mb-1 truncate group-hover:text-primary-600 transition-colors">
          {item.titulo}
        </h3>
        
        {/* Meta tags resumidas para mobile */}
        <div className="flex flex-wrap gap-1 md:gap-1.5 mt-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[8px] md:text-[10px] font-bold">
            <Tag size={8} className="md:w-[10px] md:h-[10px]" />
            {CATEGORIAS_LABELS[item.categoria]?.split(' ')[1] || item.categoria}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[8px] md:text-[10px] font-bold">
            <MapPin size={8} className="md:w-[10px] md:h-[10px]" />
            <span className="truncate max-w-[50px] md:max-w-[80px]">{item.local}</span>
          </span>
        </div>

        {/* Author - Oculto no mobile para manter limpo */}
        {item.usuario && (
          <div className="hidden md:flex items-center gap-2 pt-3 mt-3 border-t border-slate-50">
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
