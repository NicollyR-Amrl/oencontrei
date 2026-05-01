// Login — Página de login

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';

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
      
      // Validação de tipo de acesso (recurso visual, backend verifica o cargo real)
      if (tipoLogin === 'ADMIN' && usuario.cargo !== 'ADMIN') {
        setErro('Esta conta não tem privilégios de administrador.');
        return;
      }
      
      // Redirecionamento por cargo
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
    <div className="min-h-screen flex items-center justify-center p-4 w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold gradient-text mb-2 animate-pulse-glow inline-block px-4 py-1 rounded-full">O Encontrei!</h1>
          <p className="text-texto-secundario text-sm">Escola Estadual Gov. Milton Campos</p>
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-[1.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary-100/30">
          
          <h2 className="text-2xl font-bold mb-8 text-center text-texto-primario flex justify-center items-center gap-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-center text-texto-secundario text-sm mb-6 -mt-6">Faça login para continuar</p>

          {erro && (
            <div className="bg-perigo-500/10 border border-perigo-500/30 text-perigo-600 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-secundario" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ou matrícula"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-secundario" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Senha"
                  className="input-field pl-11 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-texto-secundario hover:text-primary-500 transition-colors bg-transparent border-none p-1"
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Esqueceu sua senha?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className={`w-full justify-center py-3.5 text-base mt-2 transition-all ${
                tipoLogin === 'ADMIN' 
                  ? 'btn-outline border-2' 
                  : 'btn-primary'
              }`}
            >
              {carregando ? (
                <span className="flex items-center gap-2 font-semibold">
                  <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                  Aguarde...
                </span>
              ) : (
                <span className="flex items-center gap-2 font-semibold">
                  <LogIn size={20} /> {tipoLogin === 'ADMIN' ? 'Entrar como Administrador' : 'Entrar como Aluno'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setTipoLogin(tipoLogin === 'ALUNO' ? 'ADMIN' : 'ALUNO')}
              className={`w-full justify-center py-3.5 text-base transition-all ${
                tipoLogin === 'ALUNO' 
                  ? 'btn-outline border-2' 
                  : 'btn-primary'
              }`}
            >
              <span className="flex items-center gap-2 font-semibold">
                 {tipoLogin === 'ALUNO' ? <Shield size={20} /> : <User size={20} />} 
                 {tipoLogin === 'ALUNO' ? 'Entrar como Administrador' : 'Entrar como Aluno'}
              </span>
            </button>
          </div>

          {tipoLogin === 'ALUNO' && (
            <p className="text-center text-texto-secundario text-sm mt-8">
              Ainda não tem uma conta?{' '}
              <Link to="/cadastro" className="text-primary-600 hover:text-primary-800 font-bold transition-colors">
                Cadastre-se
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
