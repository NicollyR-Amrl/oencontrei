import { useState, useEffect } from 'react';
import { Package, Check, Trash2, Search, Filter } from 'lucide-react';
import api from '../../servicos/api';
import { useNavigate } from 'react-router-dom';

export default function AdminItens() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const navigate = useNavigate();

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
    if (!confirm('Tem certeza que deseja remover este item? (Isso não pode ser desfeito)')) return;
    try {
      await api.delete(`/admin/itens/${id}`);
      carregarItens();
    } catch (err) {
      alert('Erro ao deletar item');
    }
  };

  // Filtro local (já que os itens admin geralmente são retornados inteiros no MVP, ou adaptamos para backend)
  const itensFiltrados = itens.filter(item => {
    const term = busca.toLowerCase();
    const matchBusca = item.titulo.toLowerCase().includes(term) || item.descricao.toLowerCase().includes(term);
    const matchStatus = filtroStatus === 'TODOS' || item.status === filtroStatus;
    
    return matchBusca && matchStatus;
  });

  if (carregando) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-4">
      
      {/* Barra de Ferramentas / Busca */}
      <div className="bg-white p-4 rounded-xl border border-borda shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto-secundario" />
          <input
            type="text"
            placeholder="Buscar relatos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-texto-secundario" />
          <select 
            value={filtroStatus} 
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="input-field py-2"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="ATIVO">Ativos</option>
            <option value="DEVOLVIDO">Devolvidos</option>
          </select>
        </div>
      </div>

      {/* Tabela de Gestão */}
      <div className="bg-white rounded-2xl overflow-hidden border border-borda shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-texto-secundario text-left border-b border-borda bg-primary-50/30 font-medium">
                <th className="p-4 w-1/3">Item Relatado</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Status Atual</th>
                <th className="p-4">Reportado por</th>
                <th className="p-4 text-center">Ações Gerenciais</th>
              </tr>
            </thead>
            <tbody>
              {itensFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-texto-secundario">
                    Nenhum item encontrado com esses filtros.
                  </td>
                </tr>
              ) : (
                itensFiltrados.map((item) => (
                  <tr key={item.id} className="border-b border-borda/50 hover:bg-primary-50/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-texto-primario line-clamp-1">{item.titulo}</p>
                      <p className="text-xs text-texto-secundario line-clamp-1 mt-0.5">{item.descricao}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        item.tipo === 'PERDIDO' ? 'bg-perigo-500/10 text-perigo-600' : 'bg-acento-500/10 text-acento-600'
                      }`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'DEVOLVIDO' ? 'bg-acento-500/10 text-acento-600' : 'bg-primary-100 text-primary-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center text-[10px] font-bold text-primary-800">
                          {item.usuario?.nome?.charAt(0)}
                        </div>
                        <span className="text-texto-secundario truncate max-w-[120px]">{item.usuario?.nome}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => navigate(`/chat/${item.usuarioId}`)}
                          className="p-1.5 bg-secondary-100 text-secondary-600 rounded-lg hover:bg-secondary-200 transition-colors"
                          title="Falar com o aluno"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                        </button>
                        {item.status === 'ATIVO' && (
                          <button 
                            onClick={() => marcarDevolvido(item.id)}
                            className="p-1.5 bg-acento-500/10 text-acento-600 rounded-lg hover:bg-acento-500/20 transition-colors"
                            title="Marcar como devolvido/resolvido"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => deletar(item.id)}
                          className="p-1.5 bg-perigo-500/10 text-perigo-500 rounded-lg hover:bg-perigo-500/20 transition-colors"
                          title="Remover Conteúdo Inapropriado"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
