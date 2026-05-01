import { useState, useEffect } from 'react';
import { Users, Package, Handshake, Check, AlertCircle } from 'lucide-react';
import api from '../../servicos/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
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
    carregarStats();
  }, []);

  if (carregando) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!stats) return null;

  // Adaptando os cards para exibir exatamente as métricas exigidas nos requisitos
  const cards = [
    { label: 'Itens Encontrados', valor: stats.itensEncontrados || 0, icone: Package, corBg: 'bg-acento-500/10', corIcone: 'text-acento-600' },
    { label: 'Itens Perdidos', valor: stats.itensPerdidos || 0, icone: Package, corBg: 'bg-perigo-500/10', corIcone: 'text-perigo-500' },
    { label: 'Itens Devolvidos', valor: stats.itensDevolvidos || 0, icone: Check, corBg: 'bg-aviso-500/10', corIcone: 'text-aviso-500' },
    { label: 'Relatos Ativos', valor: (stats.itensEncontrados + stats.itensPerdidos - stats.itensDevolvidos) || 0, icone: AlertCircle, corBg: 'bg-primary-100', corIcone: 'text-primary-600' },
    { label: 'Total Matches', valor: stats.totalMatches || 0, icone: Handshake, corBg: 'bg-primary-50', corIcone: 'text-primary-500' },
    { label: 'Usuários Cadastrados', valor: stats.totalUsuarios || 0, icone: Users, corBg: 'bg-secondary-100', corIcone: 'text-secondary-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((s) => (
          <div key={s.label} className="card text-center flex flex-col items-center justify-center p-6">
            <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${s.corBg}`}>
              <s.icone size={28} className={s.corIcone} />
            </div>
            <p className="text-3xl font-extrabold text-texto-primario mb-1">{s.valor}</p>
            <p className="text-xs font-semibold text-texto-secundario uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
