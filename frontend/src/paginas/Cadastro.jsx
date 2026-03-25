// Cadastro — Página de registro

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, School } from 'lucide-react';

export default function Cadastro() {
  const [formulario, setFormulario] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '', turma: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

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
      await registrar({
        nome: formulario.nome,
        email: formulario.email,
        senha: formulario.senha,
        turma: formulario.turma || null
      });
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
