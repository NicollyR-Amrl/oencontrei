// Inicio — Página principal com listagem de itens (Layout Limpo e Espaçoso)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicos/api';
import CartaoItem from '../componentes/CartaoItem';
import { Search, PlusCircle, PackageSearch, ChevronRight, Frown, Sparkles, RefreshCw, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const CATEGORIAS = [
  { valor: '', label: 'Todas as Categorias', emoji: '✨' },
  { valor: 'ROUPA', label: 'Roupas', emoji: '👕' },
  { valor: 'ELETRONICO', label: 'Eletrônicos', emoji: '📱' },
  { valor: 'MATERIAL_ESCOLAR', label: 'Material Escolar', emoji: '📚' },
  { valor: 'ACESSORIO', label: 'Acessórios', emoji: '⌚' },
  { valor: 'CHAVE', label: 'Chaves', emoji: '🔑' },
  { valor: 'DOCUMENTO', label: 'Documentos', emoji: '📄' },
  { valor: 'GARRAFA', label: 'Garrafas / Copos', emoji: '🥤' },
  { valor: 'OUTRO', label: 'Outros', emoji: '📦' },
];

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
    <div className="animate-fade-in space-y-8 pb-12">

      {/* ═══════════════ HERO BANNER ESPAÇOSO ═══════════════ */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-lg shadow-blue-500/15 p-8 md:p-10 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-xs font-semibold text-white backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-200" />
              <span>O Encontrei! — Plataforma Escolar</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-snug">
              Olá, {primeiroNome}! 👋
            </h1>
            <p className="text-blue-50 text-sm md:text-base font-normal leading-relaxed opacity-90">
              Achou um pertence perdido na escola ou precisa localizar algo seu? Conectamos você de forma simples e rápida.
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <PackageSearch size={26} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white leading-none">{itens.length}</p>
              <p className="text-xs text-blue-100 font-medium mt-1">itens cadastrados</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ CARDS DE AÇÃO RÁPIDA ═══════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <button
          onClick={() => navigate('/encontrei')}
          className="group bg-white rounded-3xl p-6 md:p-8 flex items-center justify-between border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <PlusCircle size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">
                Encontrei um pertence
              </h3>
              <p className="text-xs md:text-sm text-slate-500 font-normal">Cadastre um objeto achado para ajudar a devolver</p>
            </div>
          </div>
          <ChevronRight size={22} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </button>

        <button
          onClick={() => navigate('/perdi')}
          className="group bg-white rounded-3xl p-6 md:p-8 flex items-center justify-between border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Search size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-rose-600 transition-colors">
                Perdi um pertence
              </h3>
              <p className="text-xs md:text-sm text-slate-500 font-normal">Publique e busque itens perdidos pela comunidade</p>
            </div>
          </div>
          <ChevronRight size={22} className="text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
        </button>
      </div>

      {/* ═══════════════ BUSCA E FILTROS ═══════════════ */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Barra de Pesquisa */}
        <form onSubmit={handleBusca} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar por título ou descrição..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md shadow-blue-600/20 transition-all shrink-0"
          >
            Buscar
          </button>
        </form>

        {/* Linha de Filtros (Com espaçamento adequado) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Tabs de Filtro de Tipo com Botões Individuais */}
          <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 self-start sm:self-auto">
            {[
              { id: '', label: 'Todos os registros' },
              { id: 'ENCONTRADO', label: 'Achados ✅' },
              { id: 'PERDIDO', label: 'Perdidos ❗' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFiltroTipo(t.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  filtroTipo === t.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Categoria Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:border-slate-300 transition-colors"
            >
              {CATEGORIAS.map(cat => (
                <option key={cat.valor} value={cat.valor}>{cat.emoji} {cat.label}</option>
              ))}
            </select>

            {(busca || filtroTipo || filtroCategoria) && (
              <button
                onClick={() => { setBusca(''); setFiltroTipo(''); setFiltroCategoria(''); carregarItens(); }}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs px-3 py-2.5 rounded-xl transition-colors shrink-0"
                title="Limpar filtros"
              >
                <RefreshCw size={14} /> Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ LISTAGEM DE ITENS (GRID DE 3 COLUNAS) ═══════════════ */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              {filtroTipo === 'ENCONTRADO' ? 'Pertences Encontrados' : filtroTipo === 'PERDIDO' ? 'Pertences Perdidos' : 'Publicações Recentes'}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Exibindo os pertences cadastrados</p>
          </div>
        </div>

        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : itens.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <Frown size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum item encontrado</h3>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
              Não encontramos pertences com os filtros atuais. Tente ajustar a busca ou cadastrar um novo item.
            </p>
            <button 
              onClick={() => navigate('/encontrei')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
            >
              Cadastrar pertence
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itens.map((item) => (
              <CartaoItem key={item.id} item={item} onClick={(i) => navigate(`/item/${i.id}`)} />
            ))}
          </div>
        )}

        {/* Paginação */}
        {paginacao.totalPaginas > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            {Array.from({ length: paginacao.totalPaginas }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => carregarItens(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                  paginacao.pagina === i + 1
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
