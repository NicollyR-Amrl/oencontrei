// DetalhesItem — Página Premium de Detalhes do Item

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../servicos/api';
import { 
  ChevronLeft, MessageCircle, MapPin, Calendar, Tag, 
  Trash2, Edit3, User, Share2, Info, ArrowRight, ShieldCheck
} from 'lucide-react';

const CATEGORIAS_LABELS = {
  ELETRONICO: '📱 Eletrônico',
  ROUPA: '👕 Roupa',
  MATERIAL_ESCOLAR: '📚 Material Escolar',
  ACESSORIO: '⌚ Acessório',
  DOCUMENTO: '📄 Documento',
  CHAVE: '🔑 Chave',
  GARRAFA: '🥤 Garrafa',
  OUTRO: '📦 Outro',
};

export default function DetalhesItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarItem = async () => {
      try {
        const res = await api.get(`/itens/${id}`);
        setItem(res.data.item);
      } catch (err) {
        console.error('Erro ao carregar item:', err);
        alert('Item não encontrado');
        navigate('/');
      } finally {
        setCarregando(false);
      }
    };
    carregarItem();
  }, [id, navigate]);

  const handleDeletar = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await api.delete(`/itens/${item.id}`);
      navigate('/');
    } catch (err) {
      alert('Erro ao excluir item');
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) return null;

  const ehDono = usuario?.id === item.usuarioId;
  const ehPerdido = item.tipo === 'PERDIDO';

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-6 transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary-100 transition-all">
          <ChevronLeft size={20} />
        </div>
        <span>Voltar</span>
      </button>

      <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100">
        <div className="flex flex-col lg:flex-row">
          {/* LADO ESQUERDO: IMAGEM */}
          <div className="w-full lg:w-[450px] bg-slate-50 relative aspect-square lg:aspect-auto">
            {item.imagem ? (
              <img 
                src={item.imagem} 
                alt={item.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-100 to-primary-50">
                <div className="text-8xl">{ehPerdido ? '🔍' : '📦'}</div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sem Foto</p>
              </div>
            )}
            
            {/* Badge de Status */}
            <div className={`absolute top-6 left-6 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg animate-pulse-glow ${
              ehPerdido ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {ehPerdido ? 'Perdido' : 'Encontrado'}
            </div>
          </div>

          {/* LADO DIREITO: CONTEÚDO */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="mb-8">
              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-800 leading-tight">
                  {item.titulo}
                </h1>
                <button className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-500 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-black text-white shadow-md">
                  {item.usuario?.nome?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700">{item.usuario?.nome}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {item.usuario?.turma || 'Estudante'} • {new Date(item.criadoEm).toLocaleDateString()}
                  </p>
                </div>
                {ehDono && (
                  <span className="ml-auto bg-primary-100 text-primary-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Meu Post</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-primary-500 font-bold mb-3">
                <Info size={16} />
                <span className="text-xs uppercase tracking-widest">Descrição detalhada</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-base whitespace-pre-wrap">
                {item.descricao}
              </p>
            </div>

            {/* Tags e Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              <div className="bg-primary-50/50 p-4 rounded-2xl border border-primary-100">
                <Tag size={16} className="text-primary-500 mb-2" />
                <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest">Categoria</p>
                <p className="font-bold text-slate-700 text-sm">{CATEGORIAS_LABELS[item.categoria] || item.categoria}</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <MapPin size={16} className="text-emerald-500 mb-2" />
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Local</p>
                <p className="font-bold text-slate-700 text-sm">{item.local}</p>
              </div>
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <Calendar size={16} className="text-amber-500 mb-2" />
                <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Data</p>
                <p className="font-bold text-slate-700 text-sm">{new Date(item.criadoEm).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              {ehDono ? (
                <>
                  <button 
                    onClick={() => navigate(`/editar-item/${item.id}`)}
                    className="flex-1 bg-slate-800 text-white hover:bg-slate-900 px-8 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95"
                  >
                    <Edit3 size={18} /> Editar Publicação
                  </button>
                  <button 
                    onClick={handleDeletar}
                    className="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-4 rounded-2xl font-black text-sm border border-rose-100 transition-all active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate(`/chat/${item.usuarioId}`)}
                    className="flex-1 bg-primary-500 text-white hover:bg-primary-600 px-8 py-5 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 transition-all active:scale-95"
                  >
                    <MessageCircle size={22} /> Falar com {item.usuario?.nome?.split(' ')[0]}
                  </button>
                  <button className="p-5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all">
                    <ShieldCheck size={24} />
                  </button>
                </>
              )}
            </div>
            
            {!ehDono && (
              <p className="text-[10px] text-slate-400 text-center mt-6 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                👮 Sua segurança é nossa prioridade. Negocie sempre em locais públicos.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
