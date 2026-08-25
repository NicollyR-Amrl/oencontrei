import { useState, useEffect } from 'react';
import { Users, Package, Handshake, Check, AlertCircle, Sparkles, Bot, Loader2, RefreshCw } from 'lucide-react';
import api from '../../servicos/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [relatorioIA, setRelatorioIA] = useState('');
  const [carregandoIA, setCarregandoIA] = useState(false);

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    try {
      const res = await api.get('/admin/estatisticas');
      setStats(res.data.estatisticas);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setCarregando(false);
    }
  };

  const gerarRelatorioIA = async () => {
    setCarregandoIA(true);
    try {
      const res = await api.get('/ia/resumo-admin');
      if (res.data.sucesso) {
        setRelatorioIA(res.data.relatorio);
      }
    } catch (err) {
      console.error('Erro ao gerar relatório com IA:', err);
    } finally {
      setCarregandoIA(false);
    }
  };

  if (carregando) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!stats) return null;

  const cards = [
    { label: 'Itens Encontrados', valor: stats.itensEncontrados || 0, icone: Package, corBg: 'bg-acento-500/10', corIcone: 'text-acento-600' },
    { label: 'Itens Perdidos', valor: stats.itensPerdidos || 0, icone: Package, corBg: 'bg-perigo-500/10', corIcone: 'text-perigo-500' },
    { label: 'Itens Devolvidos', valor: stats.itensDevolvidos || 0, icone: Check, corBg: 'bg-aviso-500/10', corIcone: 'text-aviso-500' },
    { label: 'Relatos Ativos', valor: (stats.itensEncontrados + stats.itensPerdidos - stats.itensDevolvidos) || 0, icone: AlertCircle, corBg: 'bg-primary-100', corIcone: 'text-primary-600' },
    { label: 'Total Matches', valor: stats.totalMatches || 0, icone: Handshake, corBg: 'bg-primary-50', corIcone: 'text-primary-500' },
    { label: 'Usuários Cadastrados', valor: stats.totalUsuarios || 0, icone: Users, corBg: 'bg-secondary-100', corIcone: 'text-secondary-600' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((s) => (
          <div key={s.label} className="card text-center flex flex-col items-center justify-center p-4 sm:p-6">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl mb-3 sm:mb-4 flex items-center justify-center ${s.corBg}`}>
              <s.icone className={`w-6 h-6 sm:w-7 sm:h-7 ${s.corIcone}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-texto-primario mb-1">{s.valor}</p>
            <p className="text-[10px] sm:text-xs font-semibold text-texto-secundario uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Painel de IA Qwen */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-violet-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-400/30 flex items-center justify-center text-amber-300">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                Diagnóstico & Relatório Executivo de IA
                <span className="bg-violet-500/30 text-amber-300 border border-amber-300/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={10} /> Nemotron 3.5
                </span>
              </h3>
              <p className="text-violet-200 text-xs font-medium">Análise em tempo real de eficiência, devoluções e sugestões para a direção escolar.</p>
            </div>
          </div>

          <button
            onClick={gerarRelatorioIA}
            disabled={carregandoIA}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] disabled:opacity-50"
          >
            {carregandoIA ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span>{carregandoIA ? 'Gerando Relatório...' : 'Gerar Relatório com IA'}</span>
          </button>
        </div>

        {relatorioIA ? (
          <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-6 border border-violet-500/20 text-slate-100 text-sm space-y-4 leading-relaxed font-sans shadow-inner">
            {relatorioIA.split('\n\n').map((bloco, idx) => {
              const linhas = bloco.trim().split('\n');
              const ehTitulo = linhas[0] && (linhas[0].includes('DIAGNÓSTICO') || linhas[0].includes('EFICIÊNCIA') || linhas[0].includes('RECOMENDAÇÕES') || linhas[0].startsWith('📊') || linhas[0].startsWith('💡') || linhas[0].startsWith('🚀'));
              
              if (ehTitulo && linhas.length > 1) {
                return (
                  <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                    <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      {linhas[0]}
                    </h4>
                    <div className="text-violet-100 text-xs sm:text-sm space-y-1.5 pl-1">
                      {linhas.slice(1).map((linha, lIdx) => (
                        <p key={lIdx} className={linha.startsWith('•') ? 'flex items-start gap-2 text-violet-200' : ''}>
                          {linha}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="space-y-1.5">
                  {linhas.map((linha, lIdx) => (
                    <p key={lIdx} className={linha.startsWith('•') ? 'flex items-start gap-2 text-violet-200 pl-2' : ehTitulo ? 'font-bold text-amber-300 text-sm' : 'text-violet-100'}>
                      {linha}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-violet-300/70 border border-dashed border-violet-500/30 rounded-xl bg-white/5 text-xs">
            Clique no botão acima para gerar um relatório inteligente completo com diagnóstico da escola.
          </div>
        )}
      </div>
    </div>
  );
}
