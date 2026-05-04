// Perfil — Perfil do usuário, histórico e notificações

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotificacoes } from '../hooks/useNotificacoes';
import NotificacaoComp from '../componentes/Notificacao';
import api from '../servicos/api';
import { Star, Bell, CheckCheck, Settings } from 'lucide-react';

export default function Perfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: usuario?.nome || '', turma: usuario?.turma || '' });

  const salvar = async () => {
    try {
      const res = await api.put('/autenticacao/perfil', form);
      atualizarUsuario(res.data.usuario);
      setEditando(false);
    } catch { alert('Erro ao atualizar'); }
  };

  const abaBtnCls = (aba) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
    abaAtiva === aba ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white text-texto-secundario border border-borda hover:border-primary-300 hover:bg-primary-50'
  }`;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Card perfil */}
      <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm border border-borda">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-4xl font-bold text-white shrink-0 animate-pulse-glow">
            {usuario?.nome?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold gradient-text">{usuario?.nome}</h1>
            <p className="text-texto-secundario text-sm mt-1">{usuario?.email}</p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start flex-wrap">
              {usuario?.turma && <span className="text-sm bg-primary-50 px-3 py-1 rounded-full border border-primary-200">🏫 {usuario.turma}</span>}
              <span className="text-sm bg-primary-50 px-3 py-1 rounded-full border border-primary-200 flex items-center gap-1"><Star size={14} className="text-aviso-500" /> {usuario?.reputacao || 0} pts</span>
              <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">{usuario?.cargo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setAbaAtiva('perfil')} className={abaBtnCls('perfil')}><Settings size={16} /> Dados</button>
        <button onClick={() => setAbaAtiva('notificacoes')} className={`${abaBtnCls('notificacoes')} relative`}>
          <Bell size={16} /> Notificações
          {naoLidas > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-perigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{naoLidas}</span>}
        </button>
      </div>

      {abaAtiva === 'perfil' ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-borda">
          {editando ? (
            <div className="space-y-4">
              <div><label className="block text-sm text-texto-secundario mb-2">Nome</label><input type="text" value={form.nome} onChange={e => setForm(p => ({...p, nome: e.target.value}))} className="input-field" /></div>
              <div><label className="block text-sm text-texto-secundario mb-2">Turma</label><input type="text" value={form.turma} onChange={e => setForm(p => ({...p, turma: e.target.value}))} className="input-field" /></div>
              <div className="flex gap-3"><button onClick={salvar} className="btn-primary">Salvar</button><button onClick={() => setEditando(false)} className="btn-secondary">Cancelar</button></div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[['Nome', usuario?.nome], ['Email', usuario?.email], ['Turma', usuario?.turma || 'N/A'], ['Reputação', `${usuario?.reputacao || 0} pts`]].map(([l, v]) => (
                  <div key={l} className="bg-primary-50/50 rounded-xl p-4 border border-primary-100"><p className="text-xs text-texto-secundario mb-1">{l}</p><p className="font-semibold text-texto-primario">{v}</p></div>
                ))}
              </div>
              <button onClick={() => setEditando(true)} className="btn-secondary"><Settings size={16} /> Editar</button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-borda">
          {naoLidas > 0 && <button onClick={marcarTodasComoLidas} className="btn-secondary text-sm mb-4"><CheckCheck size={16} /> Marcar todas como lidas</button>}
          <div className="space-y-3">
            {notificacoes.length === 0 ? (
              <div className="text-center py-10"><Bell size={48} className="mx-auto text-primary-200 mb-3" /><p className="text-texto-secundario">Nenhuma notificação</p></div>
            ) : notificacoes.map(n => <NotificacaoComp key={n.id} notificacao={n} onMarcarLida={marcarComoLida} />)}
          </div>
        </div>
      )}
    </div>
  );
}
