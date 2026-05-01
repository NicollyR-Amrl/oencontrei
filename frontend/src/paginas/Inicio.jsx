// Inicio — Página principal com listagem de itens

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicos/api';
import CartaoItem from '../componentes/CartaoItem';
import { Search, PlusCircle, AlertTriangle, Filter, Package } from 'lucide-react';

const CATEGORIAS = [
  { valor: '', label: 'Todas' },
  { valor: 'ELETRONICO', label: '📱 Eletrônico' },
  { valor: 'ROUPA', label: '👕 Roupa' },
  { valor: 'MATERIAL_ESCOLAR', label: '📚 Material' },
  { valor: 'ACESSORIO', label: '💍 Acessório' },
  { valor: 'DOCUMENTO', label: '📄 Documento' },
  { valor: 'CHAVE', label: '🔑 Chave' },
  { valor: 'GARRAFA', label: '🧴 Garrafa' },
  { valor: 'OUTRO', label: '📦 Outro' },
];

export default function Inicio() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [paginacao, setPaginacao] = useState({ pagina: 1, totalPaginas: 1 });
  const navigate = useNavigate();

  const carregarItens = async (pagina = 1) => {
    setCarregando(true);
    try {
      const params = { pagina, limite: 12 };
      if (busca) params.busca = busca;
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroCategoria) params.categoria = filtroCategoria;

      const res = await api.get('/itens', { params });
      setItens(res.data.itens);
      setPaginacao(res.data.paginacao);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarItens();
  }, [filtroTipo, filtroCategoria]);

  const handleBusca = (e) => {
    e.preventDefault();
    carregarItens();
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-texto-primario mb-2">
          Olá! 👋
        </h1>
        <p className="text-texto-secundario text-lg">
          O que você deseja fazer hoje?
        </p>
      </div>

      {/* Botões de ação principais */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <button
          onClick={() => navigate('/encontrei')}
          className="bg-primary-500 hover:bg-primary-600 text-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all shadow-[0_8px_24px_rgba(26,115,232,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(26,115,232,0.35)]"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <PlusCircle size={32} />
          </div>
          <span className="font-bold text-lg text-center leading-tight">Encontrei<br/>um item</span>
        </button>
        <button
          onClick={() => navigate('/perdi')}
          className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,107,107,0.35)]"
        >
          <div className="bg-white/20 p-4 rounded-full">
            <Search size={32} />
          </div>
          <span className="font-bold text-lg text-center leading-tight">Perdi<br/>um item</span>
        </button>
      </div>

      {/* Barra de busca */}
      <form onSubmit={handleBusca} className="mb-8">
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-5 text-texto-secundario" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por itens, locais, descrições..."
            className="w-full bg-white py-4 pl-14 pr-14 rounded-full border border-borda shadow-[0_4px_16px_rgba(0,0,0,0.04)] focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-400/10 transition-all"
          />
          <button type="button" className="absolute right-5 text-primary-500 hover:bg-primary-50 p-2 rounded-full transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </form>

      {/* Título Seção */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-texto-primario">Itens encontrados recentemente</h2>
        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">Ver todos</button>
      </div>

      {/* Filtros ocultos por padrão, podem ser mostrados no clique do ícone de filtro futuramente */}
      {/* 
      <div className="flex flex-wrap gap-3 mb-6">
        ...
      </div>
      */}

      {/* Lista de itens */}
      {carregando ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : itens.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-primary-200 mb-4" />
          <p className="text-texto-secundario text-lg">Nenhum item encontrado</p>
          <p className="text-texto-secundario text-sm mt-1">Tente ajustar os filtros ou busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {itens.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <CartaoItem item={item} onClick={() => {}} />
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {paginacao.totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: paginacao.totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => carregarItens(i + 1)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                paginacao.pagina === i + 1
                  ? 'gradient-primary text-white shadow-md'
                  : 'bg-white text-texto-secundario border border-borda hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
