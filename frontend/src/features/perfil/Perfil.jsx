// Perfil — Perfil do usuário, histórico e notificações

import { useState, useRef } from 'react';
import { useAuth } from '../autenticacao/useAuth';
import { useNotificacoes } from '../notificacoes/useNotificacoes';
import NotificacaoComp from '../notificacoes/Notificacao';
import api, { BASE_URL } from '../../shared/servicos/api';
import { Star, Bell, CheckCheck, Settings, Camera, Trash2, X } from 'lucide-react';

export default function Perfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();
  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: usuario?.nome || '', turma: usuario?.turma || '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const salvar = async () => {
    try {
      const formData = new FormData();
      formData.append('nome', form.nome);
      formData.append('turma', form.turma);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.put('/autenticacao/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      atualizarUsuario(res.data.usuario);
      setEditando(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (e) { 
      console.error(e);
      alert('Erro ao atualizar'); 
    }
  };

  const removerAvatar = async () => {
    if (!window.confirm('Tem certeza que deseja remover sua foto de perfil?')) return;
    try {
      const formData = new FormData();
      formData.append('removerAvatar', 'true');
      
      const res = await api.put('/autenticacao/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      atualizarUsuario(res.data.usuario);
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (e) { 
      alert('Erro ao remover foto'); 
    }
  };

  const abaBtnCls = (aba) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${abaAtiva === aba ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-fundo-card text-texto-secundario border border-borda hover:border-primary-500/30'
    }`;

  const renderAvatar = () => {
    const displayImage = avatarPreview || (usuario?.avatar ? `${BASE_URL}${usuario.avatar}` : null);
    
    if (displayImage) {
      return (
        <div className="relative group">
          <img 
            src={displayImage} 
            alt={usuario?.nome} 
            className="w-24 h-24 rounded-full object-cover border-4 border-primary-500/20"
          />
          {editando && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white text-xs"
            >
              <Camera size={20} />
            </button>
          )}
        </div>
      );
    }

    return (
      <div 
        className={`w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-4xl font-bold text-white shrink-0 animate-pulse-glow cursor-pointer`}
        onClick={() => editando && fileInputRef.current?.click()}
      >
        {usuario?.nome?.charAt(0)?.toUpperCase()}
        {editando && (
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera size={20} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Card perfil */}
      <div className="glass-strong rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {renderAvatar()}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold gradient-text">{usuario?.nome}</h1>
            <p className="text-texto-secundario text-sm mt-1">{usuario?.email}</p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start flex-wrap">
              {usuario?.avatar && editando && (
                <button 
                  onClick={removerAvatar}
                  className="text-xs flex items-center gap-1 text-perigo-400 hover:text-perigo-300 transition-colors bg-perigo-500/10 px-2 py-1 rounded-md"
                >
                  <Trash2 size={12} /> Remover foto
                </button>
              )}
              {usuario?.turma && <span className="text-sm bg-fundo-card px-3 py-1 rounded-full border border-borda">🏫 {usuario.turma}</span>}
              <span className="text-sm bg-fundo-card px-3 py-1 rounded-full border border-borda flex items-center gap-1"><Star size={14} className="text-aviso-400" /> {usuario?.reputacao || 0} pts</span>
              <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full font-medium">{usuario?.cargo}</span>
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
        <div className="glass-strong rounded-2xl p-6">
          {editando ? (
            <div className="space-y-4">
              <div><label className="block text-sm text-texto-secundario mb-2">Nome</label><input type="text" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} className="input-field" /></div>
              <div><label className="block text-sm text-texto-secundario mb-2">Turma</label><input type="text" value={form.turma} onChange={e => setForm(p => ({ ...p, turma: e.target.value }))} className="input-field" /></div>
              <div className="flex gap-3">
                <button onClick={salvar} className="btn-primary">Salvar Alterações</button>
                <button onClick={() => {
                  setEditando(false);
                  setAvatarPreview(null);
                  setAvatarFile(null);
                  setForm({ nome: usuario?.nome || '', turma: usuario?.turma || '' });
                }} className="btn-secondary">Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[['Nome', usuario?.nome], ['Email', usuario?.email], ['Turma', usuario?.turma || 'N/A'], ['Reputação', `${usuario?.reputacao || 0} pts`]].map(([l, v]) => (
                  <div key={l} className="bg-fundo-card rounded-xl p-4 border border-borda"><p className="text-xs text-texto-secundario mb-1">{l}</p><p className="font-semibold">{v}</p></div>
                ))}
              </div>
              <button onClick={() => setEditando(true)} className="btn-secondary"><Settings size={16} /> Editar Perfil</button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-strong rounded-2xl p-6">
          {naoLidas > 0 && <button onClick={marcarTodasComoLidas} className="btn-secondary text-sm mb-4"><CheckCheck size={16} /> Marcar todas como lidas</button>}
          <div className="space-y-3">
            {notificacoes.length === 0 ? (
              <div className="text-center py-10"><Bell size={48} className="mx-auto text-texto-secundario opacity-30 mb-3" /><p className="text-texto-secundario">Nenhuma notificação</p></div>
            ) : notificacoes.map(n => <NotificacaoComp key={n.id} notificacao={n} onMarcarLida={marcarComoLida} />)}
          </div>
        </div>
      )}
    </div>
  );
}
