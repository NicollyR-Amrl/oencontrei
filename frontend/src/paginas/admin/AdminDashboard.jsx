import { useState, useEffect } from 'react';
import { Users, Package, Handshake, Check } from 'lucide-react';
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

  const cards = [
    { label: 'Usuários', valor: stats.totalUsuarios, icone: Users, cor: 'text-primary-400' },
    { label: 'Itens Totais', valor: stats.totalItens, icone: Package, cor: 'text-secondary-400' },
    { label: 'Itens Perdidos', valor: stats.itensPerdidos, icone: Package, cor: 'text-perigo-400' },
    { label: 'Itens Encontrados', valor: stats.itensEncontrados, icone: Package, cor: 'text-acento-400' },
    { label: 'Itens Devolvidos', valor: stats.itensDevolvidos, icone: Check, cor: 'text-aviso-400' },
    { label: 'Total Matches', valor: stats.totalMatches, icone: Handshake, cor: 'text-primary-400' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="card text-center">
            <s.icone size={24} className={`mx-auto mb-2 ${s.cor}`} />
            <p className="text-2xl font-extrabold">{s.valor}</p>
            <p className="text-xs text-texto-secundario">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
