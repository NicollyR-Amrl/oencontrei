// Cadastro — Página de registro

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, School, Camera, X } from 'lucide-react';

export default function Cadastro() {
  const [formulario, setFormulario] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '', turma: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { registrar } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormulario(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (formulario.senha !== formulario.confirmarSenha) {
      setErro('As senhas não conferem');
      return;
    }

    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('nome', formulario.nome);
      formData.append('email', formulario.email);
      formData.append('senha', formulario.senha);
      if (formulario.turma) formData.append('turma', formulario.turma);
      if (avatarFile) formData.append('avatar', avatarFile);

      await registrar(formData);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold gradient-text mb-2">O Encontrei!</h1>
          <p className="text-texto-secundario">Crie sua conta e ajude a encontrar objetos</p>
        </div>

        {/* Card de cadastro */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-center">Criar conta</h2>

          {erro && (
            <div className="bg-perigo-500/10 border border-perigo-500/30 text-perigo-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload de Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input').click()}>
                {avatarPreview ? (
                  <div className="relative">
                    <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary-500/20" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setAvatarPreview(null); setAvatarFile(null); }}
                      className="absolute -top-1 -right-1 bg-perigo-500 text-white p-1 rounded-full hover:bg-perigo-600 transition-colors shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-fundo-card border-2 border-dashed border-borda flex flex-col items-center justify-center text-texto-secundario hover:border-primary-500 hover:text-primary-400 transition-all">
                    <Camera size={28} />
                    <span className="text-[10px] font-medium mt-1 uppercase">Foto</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <input 
                id="avatar-input"
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <p className="text-xs text-texto-secundario mt-2">Toque para adicionar uma foto</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-texto-secundario mb-1.5">
                <User size={14} className="inline mr-1" /> Nome completo
              </label>
              <input type="text" name="nome" value={formulario.nome} onChange={handleChange}
                placeholder="João da Silva" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-texto-secundario mb-1.5">
                <Mail size={14} className="inline mr-1" /> Email
              </label>
              <input type="email" name="email" value={formulario.email} onChange={handleChange}
                placeholder="joao@escola.com" className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-texto-secundario mb-1.5">
                <School size={14} className="inline mr-1" /> Turma (opcional)
              </label>
              <input type="text" name="turma" value={formulario.turma} onChange={handleChange}
                placeholder="Ex: 3º A" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-texto-secundario mb-1.5">
                <Lock size={14} className="inline mr-1" /> Senha
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'} name="senha"
                  value={formulario.senha} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres" className="input-field pr-10" required
                />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-texto-secundario hover:text-primary-400 transition-colors">
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-texto-secundario mb-1.5">
                <Lock size={14} className="inline mr-1" /> Confirmar Senha
              </label>
              <input type="password" name="confirmarSenha" value={formulario.confirmarSenha}
                onChange={handleChange} placeholder="Repita a senha" className="input-field" required />
            </div>

            <button type="submit" disabled={carregando} className="btn-primary w-full justify-center py-3.5 text-base mt-2">
              {carregando ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Cadastrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={20} /> Criar conta
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-texto-secundario text-sm mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
