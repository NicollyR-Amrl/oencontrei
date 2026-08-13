import { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, ChevronDown, Users } from 'lucide-react';
import api from '../../servicos/api';
import { useAuth } from '../../hooks/useAuth';

const CARGOS = ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'ADMIN'];

const cargoCor = {
  ADMIN:       'bg-purple-100 text-purple-700 border-purple-200',
  PROFESSOR:   'bg-blue-100 text-blue-700 border-blue-200',
  FUNCIONARIO: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ALUNO:       'bg-slate-100 text-slate-600 border-slate-200',
};

const cargoIcone = {
  ADMIN:       <Shield size={12} />,
  PROFESSOR:   <User size={12} />,
  FUNCIONARIO: <User size={12} />,
  ALUNO:       <User size={12} />,
};

export default function AdminUsuarios() {
  const { usuario: eu } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [alterandoCargo, setAlterandoCargo] = useState(null); // id do usuário cujo select está aberto
  const [salvando, setSalvando] = useState(null);

  const carregar = async (termo = '') => {
    try {
      setCarregando(true);
      const res = await api.get('/admin/usuarios', { params: { busca: termo, limite: 50 } });
      setUsuarios(res.data.usuarios);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  // Debounce na busca
  useEffect(() => {
    const t = setTimeout(() => carregar(busca), 400);
    return () => clearTimeout(t);
  }, [busca]);

  const mudarCargo = async (id, novoCargo) => {
    setSalvando(id);
    try {
      await api.put(`/admin/usuarios/${id}/cargo`, { cargo: novoCargo });
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, cargo: novoCargo } : u));
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao alterar cargo');
    } finally {
      setSalvando(null);
      setAlterandoCargo(null);
    }
  };

  const deletar = async (id, nome) => {
    if (!confirm(`Tem certeza que deseja remover o usuário "${nome}"?\n\nIsso também apagará todos os itens e dados dele. Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/admin/usuarios/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao deletar usuário');
    }
  };

  return (
    <div className="animate-fade-in space-y-4">

      {/* Barra de busca */}
      <div className="bg-white p-4 rounded-xl border border-borda shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto-secundario" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-texto-secundario">
          <Users size={16} />
          <span>{usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''} encontrado{usuarios.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl overflow-hidden border border-borda shadow-sm">
        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-texto-secundario text-left border-b border-borda bg-primary-50/30 font-medium">
                  <th className="p-4">Usuário</th>
                  <th className="p-4 hidden md:table-cell">Turma</th>
                  <th className="p-4 hidden sm:table-cell">Itens</th>
                  <th className="p-4">Cargo</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-texto-secundario">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-borda/50 hover:bg-primary-50/20 transition-colors">

                    {/* Avatar + nome + email */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                          {u.nome?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-texto-primario truncate max-w-[160px]">
                            {u.nome}
                            {u.id === eu?.id && <span className="ml-1 text-[10px] text-primary-400 font-bold">(você)</span>}
                          </p>
                          <p className="text-xs text-texto-secundario truncate max-w-[160px]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Turma */}
                    <td className="p-4 hidden md:table-cell text-texto-secundario">
                      {u.turma || <span className="text-borda">—</span>}
                    </td>

                    {/* Qtd itens */}
                    <td className="p-4 hidden sm:table-cell text-texto-secundario">
                      {u._count?.itens ?? 0}
                    </td>

                    {/* Cargo — dropdown inline */}
                    <td className="p-4">
                      {u.id === eu?.id ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cargoCor[u.cargo]}`}>
                          {cargoIcone[u.cargo]} {u.cargo}
                        </span>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setAlterandoCargo(alterandoCargo === u.id ? null : u.id)}
                            disabled={salvando === u.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all hover:shadow-sm ${cargoCor[u.cargo]} ${salvando === u.id ? 'opacity-50' : 'cursor-pointer'}`}
                          >
                            {salvando === u.id
                              ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              : cargoIcone[u.cargo]
                            }
                            {u.cargo}
                            <ChevronDown size={10} className={`transition-transform ${alterandoCargo === u.id ? 'rotate-180' : ''}`} />
                          </button>

                          {alterandoCargo === u.id && (
                            <div className="absolute z-20 top-8 left-0 bg-white border border-borda rounded-xl shadow-lg py-1 min-w-[140px]">
                              {CARGOS.map(c => (
                                <button
                                  key={c}
                                  onClick={() => mudarCargo(u.id, c)}
                                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-primary-50 transition-colors ${u.cargo === c ? 'text-primary-600' : 'text-texto-primario'}`}
                                >
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cargoCor[c]}`}>
                                    {cargoIcone[c]} {c}
                                  </span>
                                  {u.cargo === c && <span className="ml-auto text-primary-400 text-[10px]">atual</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        {u.id !== eu?.id && (
                          <button
                            onClick={() => deletar(u.id, u.nome)}
                            className="p-1.5 bg-perigo-500/10 text-perigo-500 rounded-lg hover:bg-perigo-500/20 transition-colors"
                            title="Remover usuário"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
