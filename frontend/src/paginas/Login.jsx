// Login — Página de login

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Eye, EyeOff, Mail, Lock, User, Shield, Search } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [tipoLogin, setTipoLogin] = useState('ALUNO'); // 'ALUNO' ou 'ADMIN'
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const { usuario } = await login(email, senha);
      
      if (tipoLogin === 'ADMIN' && usuario.cargo !== 'ADMIN') {
        setErro('Esta conta não tem privilégios de administrador.');
        return;
      }
      
      if (usuario.cargo === 'ADMIN' || tipoLogin === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-fundo-escuro">
      {/* Lado Esquerdo - Decorativo (Oculto em telas pequenas) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900 flex-col items-center justify-center p-12">
        {/* Animação de Fundo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600 via-primary-800 to-primary-900 opacity-90"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-acento-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Conteúdo decorativo */}
        <div className="relative z-10 text-center animate-fade-in text-white max-w-lg">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-float">
            <Search size={48} className="text-secondary-300" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Nunca mais perca o que é <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-primary-200">importante</span>.
          </h1>
          <p className="text-xl text-primary-100 font-light opacity-90 leading-relaxed">
            O sistema inteligente de achados e perdidos da Escola Estadual Gov. Milton Campos.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Efeito de fundo sutil para mobile */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>

        <div className="w-full max-w-md animate-slide-up relative z-10">
          {/* Logo Mobile */}
          <div className="text-center mb-10 lg:hidden">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 mb-2">O Encontrei!</h1>
            <p className="text-texto-secundario text-sm">Escola Estadual Gov. Milton Campos</p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-texto-primario mb-3">Bem-vindo de volta</h2>
            <p className="text-texto-secundario font-medium">Faça login na sua conta para continuar</p>
          </div>

          {erro && (
            <div className="bg-perigo-500/10 border border-perigo-500/20 text-perigo-600 px-5 py-4 rounded-2xl mb-6 text-sm font-semibold flex items-center gap-3">
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-perigo-500"></span>
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="input-group">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-secundario" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ou matrícula"
                className="input-field pl-12 bg-white/80 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <div className="input-group">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-secundario" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha"
                  className="input-field pl-12 pr-12 bg-white/80 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-texto-secundario hover:text-primary-500 transition-colors bg-transparent border-none p-1"
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right mt-3">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-bold transition-colors">Esqueceu a senha?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className={`w-full py-4 text-[1.05rem] mt-4 ${
                tipoLogin === 'ADMIN' ? 'btn-outline border-2' : 'btn-primary'
              }`}
            >
              {carregando ? (
                <span className="flex items-center gap-3 font-bold">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Aguarde...
                </span>
              ) : (
                <span className="flex items-center gap-3 font-bold">
                  <LogIn size={22} /> {tipoLogin === 'ADMIN' ? 'Acessar Painel' : 'Entrar na Conta'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-borda"></div>
              <span className="flex-shrink-0 mx-4 text-texto-secundario text-xs font-semibold uppercase tracking-wider">Ou</span>
              <div className="flex-grow border-t border-borda"></div>
            </div>

            <button
              type="button"
              onClick={() => setTipoLogin(tipoLogin === 'ALUNO' ? 'ADMIN' : 'ALUNO')}
              className={`w-full py-3.5 text-sm transition-all ${
                tipoLogin === 'ALUNO' ? 'btn-secondary' : 'btn-secondary bg-primary-50 border-primary-200 text-primary-700'
              } flex justify-center items-center gap-2 font-bold`}
            >
              {tipoLogin === 'ALUNO' ? <Shield size={18} /> : <User size={18} />} 
              {tipoLogin === 'ALUNO' ? 'Sou Administrador' : 'Sou Aluno'}
            </button>
          </div>

          {tipoLogin === 'ALUNO' && (
            <p className="text-center text-texto-secundario font-medium text-sm mt-10">
              Novo por aqui?{' '}
              <Link to="/cadastro" className="text-primary-600 hover:text-primary-800 font-extrabold transition-colors">
                Criar uma conta
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
