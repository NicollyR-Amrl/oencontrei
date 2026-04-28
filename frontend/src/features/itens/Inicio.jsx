// Inicio — Página principal com listagem de itens

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/servicos/api';
import CartaoItem from './CartaoItem';
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
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">
          Achados & Perdidos
        </h1>
        <p className="text-texto-secundario">
          Encontre ou registre objetos perdidos na escola
        </p>
      </div>

      {/* Botões de ação */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/encontrei')}
          className="btn-primary justify-center py-4 text-sm md:text-base rounded-xl"
        >
          <PlusCircle size={20} /> Encontrei um Item
        </button>
        <button
          onClick={() => navigate('/perdi')}
          className="btn-danger justify-center py-4 text-sm md:text-base rounded-xl flex items-center gap-2"
        >
          <AlertTriangle size={20} /> Perdi um Item
        </button>
      </div>

      {/* Barra de busca */}
      <form onSubmit={handleBusca} className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-secundario" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar itens..."
            className="input-field pl-12 pr-24"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all">
            Buscar
          </button>
        </div>
      </form>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Filtro por tipo */}
        <div className="flex gap-2">
          {[
            { valor: '', label: 'Todos', icone: Package },
            { valor: 'ENCONTRADO', label: 'Encontrados', icone: PlusCircle },
            { valor: 'PERDIDO', label: 'Perdidos', icone: AlertTriangle },
          ].map(opt => (
            <button
              key={opt.valor}
              onClick={() => setFiltroTipo(opt.valor)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroTipo === opt.valor
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-fundo-card text-texto-secundario border border-borda hover:border-primary-500/30'
              }`}
            >
              <opt.icone size={14} /> {opt.label}
            </button>
          ))}
        </div>

        {/* Filtro por categoria */}
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="input-field w-auto text-sm"
        >
          {CATEGORIAS.map(cat => (
            <option key={cat.valor} value={cat.valor}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Lista de itens */}
      {carregando ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : itens.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-texto-secundario mb-4 opacity-30" />
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
                  ? 'gradient-primary text-white'
                  : 'bg-fundo-card text-texto-secundario border border-borda hover:border-primary-500'
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
