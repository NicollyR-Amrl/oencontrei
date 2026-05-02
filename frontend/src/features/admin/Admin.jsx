// Admin — Painel administrativo

import { useState, useEffect } from 'react';
import { useAuth } from '../autenticacao/useAuth';
import api from '../../shared/servicos/api';
import { Shield, Package, Users, Handshake, Check, Trash2, BarChart3 } from 'lucide-react';

export default function Admin() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState(null);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const [resStats, resItens] = await Promise.all([
        api.get('/admin/estatisticas'),
        api.get('/admin/itens')
      ]);
      setStats(resStats.data.estatisticas);
      setItens(resItens.data.itens);
    } catch (err) {
      console.error('Erro:', err);
    } finally { setCarregando(false); }
  };

  const marcarDevolvido = async (id) => {
    try { await api.put(`/admin/itens/${id}/devolvido`); carregarDados(); } catch (e) { alert('Erro'); }
  };

  const deletar = async (id) => {
    if (!confirm('Tem certeza?')) return;
    try { await api.delete(`/admin/itens/${id}`); carregarDados(); } catch (e) { alert('Erro'); }
  };

  if (usuario?.cargo !== 'ADMIN') {
    return <div className="text-center py-20"><Shield size={64} className="mx-auto text-perigo-400 opacity-30 mb-4" /><p className="text-perigo-400 text-lg font-bold">Acesso negado</p></div>;
  }

  if (carregando) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-extrabold gradient-text mb-6 flex items-center gap-3"><Shield size={28} /> Administração</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { l: 'Usuários', v: stats.totalUsuarios, i: Users, c: 'text-primary-400' },
            { l: 'Itens', v: stats.totalItens, i: Package, c: 'text-secondary-400' },
            { l: 'Perdidos', v: stats.itensPerdidos, i: Package, c: 'text-perigo-400' },
            { l: 'Encontrados', v: stats.itensEncontrados, i: Package, c: 'text-acento-400' },
            { l: 'Devolvidos', v: stats.itensDevolvidos, i: Check, c: 'text-aviso-400' },
            { l: 'Matches', v: stats.totalMatches, i: Handshake, c: 'text-primary-400' },
          ].map(s => (
            <div key={s.l} className="card text-center">
              <s.i size={24} className={`mx-auto mb-2 ${s.c}`} />
              <p className="text-2xl font-extrabold">{s.v}</p>
              <p className="text-xs text-texto-secundario">{s.l}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabela de itens */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-borda"><h2 className="font-bold flex items-center gap-2"><BarChart3 size={18} /> Gerenciar Itens</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-texto-secundario text-left border-b border-borda">
              <th className="p-4">Título</th><th className="p-4">Tipo</th><th className="p-4">Status</th><th className="p-4">Usuário</th><th className="p-4">Ações</th>
            </tr></thead>
            <tbody>
              {itens.map(item => (
                <tr key={item.id} className="border-b border-borda/50 hover:bg-fundo-card-hover transition-colors">
                  <td className="p-4 font-medium">{item.titulo}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${item.tipo === 'PERDIDO' ? 'bg-perigo-500/20 text-perigo-400' : 'bg-acento-500/20 text-acento-400'}`}>{item.tipo}</span></td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${item.status === 'DEVOLVIDO' ? 'bg-acento-500/20 text-acento-400' : 'bg-primary-500/20 text-primary-400'}`}>{item.status}</span></td>
                  <td className="p-4 text-texto-secundario">{item.usuario?.nome}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {item.status === 'ATIVO' && <button onClick={() => marcarDevolvido(item.id)} className="p-1.5 bg-acento-500/20 text-acento-400 rounded-lg hover:bg-acento-500/30" title="Devolvido"><Check size={14} /></button>}
                      <button onClick={() => deletar(item.id)} className="p-1.5 bg-perigo-500/20 text-perigo-400 rounded-lg hover:bg-perigo-500/30" title="Deletar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
