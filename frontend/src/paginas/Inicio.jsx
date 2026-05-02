// Inicio — Página principal com listagem de itens

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicos/api';
import CartaoItem from '../componentes/CartaoItem';
import { Search, PlusCircle, Filter, PackageSearch, ChevronRight, Frown, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Inicio() {
  const { usuario } = useAuth();
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

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Visitante';

  return (
    <div className="animate-fade-in">

      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500"></div>
        
        {/* Decorative orbs */}
        <div className="absolute top-[-30%] right-[-5%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-40%] left-[-5%] w-[300px] h-[300px] bg-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[30%] w-[150px] h-[150px] bg-white/5 rounded-full blur-2xl"></div>

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 font-medium mb-5">
                <Sparkles size={14} />
                <span>Boas-vindas</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3">
                Olá, {primeiroNome}! 👋
              </h1>
              <p className="text-primary-100/80 text-lg max-w-lg leading-relaxed">
                Encontre objetos perdidos ou cadastre algo que você achou na escola.
              </p>
            </div>
            
            {/* Stats card */}
            <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 lg:min-w-[200px]">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                <PackageSearch className="text-white" size={28} />
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white leading-none">{itens.length}</p>
                <p className="text-sm text-primary-200 font-medium mt-1">itens recentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ AÇÕES RÁPIDAS ═══════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <button
          onClick={() => navigate('/encontrei')}
          className="group bg-white rounded-2xl p-6 flex items-center gap-5 border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
            <PlusCircle size={26} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-800 leading-tight">Achei um item</h3>
            <p className="text-sm text-slate-400 mt-1">Cadastrar objeto encontrado</p>
          </div>
          <ChevronRight size={22} className="text-slate-200 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        <button
          onClick={() => navigate('/perdi')}
          className="group bg-white rounded-2xl p-6 flex items-center gap-5 border border-slate-100 hover:border-rose-200 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/25 group-hover:scale-110 transition-transform duration-300">
            <Search size={26} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-800 leading-tight">Perdi um item</h3>
            <p className="text-sm text-slate-400 mt-1">Procurar objeto perdido</p>
          </div>
          <ChevronRight size={22} className="text-slate-200 group-hover:text-rose-400 group-hover:translate-x-1 transition-all shrink-0" />
        </button>
      </div>

      {/* ═══════════════ BUSCA ═══════════════ */}
      <form onSubmit={handleBusca} className="mb-8">
        <div className="flex items-center bg-white rounded-2xl border border-slate-100 shadow-sm focus-within:border-primary-300 focus-within:shadow-lg focus-within:shadow-primary-100/30 transition-all">
          <div className="pl-6 text-slate-400">
            <Search size={22} />
          </div>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por chaves, blusa azul, caderno..."
            className="flex-1 bg-transparent py-4.5 px-4 text-base text-slate-700 font-medium focus:outline-none placeholder:text-slate-300"
          />
          <div className="pr-3">
            <button 
              type="button"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-500 transition-colors"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      </form>

      {/* ═══════════════ LISTAGEM RECENTES ═══════════════ */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Itens Recentes</h2>
          <p className="text-sm text-slate-400 mt-1">Últimos objetos cadastrados no sistema</p>
        </div>
        <button className="text-sm font-bold text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 px-5 py-2.5 rounded-xl transition-colors">
          Ver todos
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center py-24">
          <div className="w-12 h-12 border-[3px] border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
      ) : itens.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 lg:p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-primary-50 rounded-3xl flex items-center justify-center mb-6">
            <Frown size={44} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum item por aqui</h3>
          <p className="text-slate-400 text-base max-w-md leading-relaxed">
            Não encontramos nada com esses filtros. Tente ajustar a pesquisa ou cadastre um novo item!
          </p>
          <div className="flex gap-3 mt-8">
            <button 
              onClick={() => navigate('/encontrei')}
              className="bg-primary-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
            >
              Cadastrar item
            </button>
            <button 
              onClick={() => { setBusca(''); carregarItens(); }}
              className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {itens.map((item) => (
            <CartaoItem key={item.id} item={item} onClick={(i) => navigate(`/item/${i.id}`)} />
          ))}
        </div>
      )}

      {/* Paginação */}
      {paginacao.totalPaginas > 1 && (
        <div className="flex justify-center gap-2.5 mt-12">
          {Array.from({ length: paginacao.totalPaginas }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => carregarItens(i + 1)}
              className={`w-11 h-11 rounded-xl font-bold text-sm transition-all ${
                paginacao.pagina === i + 1
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-primary-200 hover:text-primary-500'
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
