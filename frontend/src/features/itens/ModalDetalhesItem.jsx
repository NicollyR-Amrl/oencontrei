import { X, MessageCircle, Trash2, Edit3, MapPin, Calendar, Tag } from 'lucide-react';
import { useAuth } from '../autenticacao/useAuth';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../../shared/servicos/api';

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

export default function ModalDetalhesItem({ item, onClose, onUpdate }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const ehDono = usuario?.id === item.usuarioId;
  const ehPerdido = item.tipo === 'PERDIDO';

  const handleDeletar = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await api.delete(`/itens/${item.id}`);
      onUpdate();
      onClose();
    } catch (err) {
      alert('Erro ao excluir item');
    }
  };

  const handleChat = () => {
    navigate(`/chat/${item.usuarioId}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative glass-strong w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Imagem */}
          <div className="w-full md:w-1/2 bg-fundo-escuro aspect-square md:aspect-auto flex items-center justify-center relative">
            {item.imagem ? (
              <img 
                src={item.imagem.startsWith('http') ? item.imagem : `${BASE_URL}${item.imagem}`} 
                alt={item.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">{ehPerdido ? '❓' : '✅'}</span>
            )}
            <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
              ehPerdido ? 'bg-perigo-500 text-white' : 'bg-acento-500 text-white'
            }`}>
              {ehPerdido ? 'PERDIDO' : 'ENCONTRADO'}
            </span>
          </div>

          {/* Conteúdo */}
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold gradient-text mb-2">{item.titulo}</h2>
              <div className="flex items-center gap-2 text-texto-secundario text-sm mb-4">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-white">
                  {item.usuario?.nome?.charAt(0)?.toUpperCase()}
                </div>
                <span>{item.usuario?.nome} • {item.usuario?.turma || 'Escola'}</span>
              </div>
              <p className="text-texto-secundario text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
                {item.descricao}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-texto-secundario">
                <Tag size={16} className="text-primary-400" />
                <span>{CATEGORIAS_LABELS[item.categoria] || item.categoria}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-texto-secundario">
                <MapPin size={16} className="text-primary-400" />
                <span>{item.local}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-texto-secundario">
                <Calendar size={16} className="text-primary-400" />
                <span>{new Date(item.criadoEm || item.data).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-borda flex gap-3">
              {ehDono ? (
                <>
                  <button 
                    onClick={() => navigate(`/editar-item/${item.id}`)}
                    className="flex-1 btn-secondary justify-center py-3"
                  >
                    <Edit3 size={18} /> Editar
                  </button>
                  <button 
                    onClick={handleDeletar}
                    className="bg-perigo-500/10 text-perigo-400 border border-perigo-500/30 hover:bg-perigo-500 hover:text-white p-3 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleChat}
                  className="flex-1 btn-primary justify-center py-3 text-base"
                >
                  <MessageCircle size={20} /> Entrar em Contato
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
