// CartaoItem — Card de item perdido/encontrado

import { MapPin, Calendar, Tag, User } from 'lucide-react';

const CATEGORIAS_LABELS = {
  ELETRONICO: '📱 Eletrônico',
  ROUPA: '👕 Roupa',
  MATERIAL_ESCOLAR: '📚 Material Escolar',
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
      className="bg-white rounded-[1.25rem] overflow-hidden cursor-pointer group animate-fade-in transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(26,115,232,0.1)] border border-borda/50"
    >
      {/* Imagem (Full width) */}
      <div className="relative h-48 bg-primary-50">
        {item.imagem ? (
          <img
            src={item.imagem}
            alt={item.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary-50 to-secondary-50">
            {ehPerdido ? '❓' : '✅'}
          </div>
        )}
        {/* Badge tipo */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
          ehPerdido
            ? 'bg-perigo-500 text-white'
            : 'bg-acento-500 text-white'
        }`}>
          {ehPerdido ? 'PERDIDO' : 'ENCONTRADO'}
        </span>
      </div>

      {/* Info Container */}
      <div className="p-5">

      {/* Info */}
      <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors truncate">
        {item.titulo}
      </h3>
      <p className="text-texto-secundario text-sm mb-3 line-clamp-2">
        {item.descricao}
      </p>

      {/* Metadados */}
      <div className="space-y-2 text-sm text-texto-secundario">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-primary-500" />
          <span>{CATEGORIAS_LABELS[item.categoria] || item.categoria}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary-500" />
          <span className="truncate">{item.local}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary-500" />
          <span>{new Date(item.criadoEm || item.data).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Rodapé — Usuário */}
      {item.usuario && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-borda">
          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
            {item.usuario.nome?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm text-texto-secundario">{item.usuario.nome}</span>
        </div>
      )}
      </div>
    </div>
  );
}
