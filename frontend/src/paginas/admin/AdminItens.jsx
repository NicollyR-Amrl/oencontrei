import { useState, useEffect } from 'react';
import { Package, Check, Trash2, BarChart3 } from 'lucide-react';
import api from '../../servicos/api';

export default function AdminItens() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarItens = async () => {
    try {
      setCarregando(true);
      const res = await api.get('/admin/itens');
      setItens(res.data.itens);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarItens();
  }, []);

  const marcarDevolvido = async (id) => {
    try {
      await api.put(`/admin/itens/${id}/devolvido`);
      carregarItens();
    } catch (err) {
      alert('Erro ao marcar como devolvido');
    }
  };

  const deletar = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;
    try {
      await api.delete(`/admin/itens/${id}`);
      carregarItens();
    } catch (err) {
      alert('Erro ao deletar item');
    }
  };

  if (carregando) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-borda">
          <h2 className="font-bold flex items-center gap-2">
            <BarChart3 size={18} /> Gerenciar Itens
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-texto-secundario text-left border-b border-borda">
                <th className="p-4">Título</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Status</th>
                <th className="p-4">Usuário</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id} className="border-b border-borda/50 hover:bg-fundo-card-hover transition-colors">
                  <td className="p-4 font-medium">{item.titulo}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item.tipo === 'PERDIDO' ? 'bg-perigo-500/20 text-perigo-400' : 'bg-acento-500/20 text-acento-400'
                    }`}>
                      {item.tipo}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'DEVOLVIDO' ? 'bg-acento-500/20 text-acento-400' : 'bg-primary-500/20 text-primary-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-texto-secundario">{item.usuario?.nome}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {item.status === 'ATIVO' && (
                        <button 
                          onClick={() => marcarDevolvido(item.id)}
                          className="p-1.5 bg-acento-500/20 text-acento-400 rounded-lg hover:bg-acento-500/30"
                          title="Devolvido"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => deletar(item.id)}
                        className="p-1.5 bg-perigo-500/20 text-perigo-400 rounded-lg hover:bg-perigo-500/30"
                        title="Deletar"
                      >
                        <Trash2 size={14} />
                      </button>
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
