// BarraNavegacao — Sidebar (desktop) + Bottom Nav (mobile)

import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/autenticacao/useAuth';
import { useNotificacoes } from '../../features/notificacoes/useNotificacoes';
import { BASE_URL } from '../../shared/servicos/api';
import { useUIStore } from '../stores/useUIStore';
import {
  Home, Search, PlusCircle, AlertTriangle, Handshake, MessageCircle,
  Bell, User, Shield, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function BarraNavegacao() {
  const { usuario, logout } = useAuth();
  const { naoLidas, carregarNotificacoes } = useNotificacoes();
  const { sidebarColapsada, toggleSidebar } = useUIStore();

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderAvatar = (size = 'md') => {
    const isMobile = size === 'sm';
    const containerClasses = isMobile 
      ? "w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-[10px]"
      : "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-md";

    if (usuario?.avatar) {
      return (
        <img 
          src={`${BASE_URL}${usuario.avatar}`} 
          alt={usuario.nome} 
          className={`${containerClasses} object-cover`}
        />
      );
    }

    return (
      <div className={`${containerClasses} gradient-primary`}>
        {usuario?.nome?.charAt(0)?.toUpperCase()}
      </div>
    );
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center ${sidebarColapsada ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-primary-500/20 text-primary-400 font-semibold'
        : 'text-texto-secundario hover:text-texto-primario hover:bg-fundo-card-hover'
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 text-xs ${
      isActive
        ? 'text-primary-400 font-semibold'
        : 'text-texto-secundario'
    }`;

  return (
    <>
      {/* ===== Sidebar Desktop ===== */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 h-full ${sidebarColapsada ? 'w-20' : 'w-64'} glass-strong z-50 p-6 transition-all duration-300 ease-in-out`}>
        {/* Toggle Button Desktop */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 transition-colors z-[60]"
        >
          {sidebarColapsada ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo */}
        <div className={`mb-8 ${sidebarColapsada ? 'text-center' : ''}`}>
          <h1 className={`${sidebarColapsada ? 'text-xl' : 'text-2xl'} font-extrabold gradient-text`}>
            {sidebarColapsada ? 'OE!' : 'O Encontrei!'}
          </h1>
          {!sidebarColapsada && <p className="text-sm text-texto-secundario mt-1">Achados & Perdidos</p>}
        </div>

        {/* Links principais (com scroll se necessário) */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <NavLink to="/" className={linkClasses} end title="Início">
            <Home size={20} /> {!sidebarColapsada && 'Início'}
          </NavLink>
          <NavLink to="/encontrei" className={linkClasses} title="Encontrei Item">
            <PlusCircle size={20} /> {!sidebarColapsada && 'Encontrei Item'}
          </NavLink>
          <NavLink to="/perdi" className={linkClasses} title="Perdi Item">
            <AlertTriangle size={20} /> {!sidebarColapsada && 'Perdi Item'}
          </NavLink>
          <NavLink to="/matches" className={linkClasses} title="Matches">
            <Handshake size={20} /> {!sidebarColapsada && 'Matches'}
          </NavLink>
          <NavLink to="/chat" className={linkClasses} title="Chat">
            <MessageCircle size={20} /> {!sidebarColapsada && 'Chat'}
          </NavLink>
          <NavLink to="/perfil" className={linkClasses} title="Perfil">
            <User size={20} /> {!sidebarColapsada && 'Perfil'}
          </NavLink>

          {usuario?.cargo === 'ADMIN' && (
            <NavLink to="/admin" className={linkClasses} title="Admin">
              <Shield size={20} /> {!sidebarColapsada && 'Admin'}
            </NavLink>
          )}
        </nav>

        {/* Rodapé da Sidebar (Fixo no rodapé) */}
        <div className="mt-auto flex flex-col gap-4">
          {/* Notificações */}
          <NavLink to="/perfil" className={`flex items-center ${sidebarColapsada ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-texto-secundario hover:text-texto-primario hover:bg-fundo-card-hover transition-all`} title="Notificações">
            <div className="relative">
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 bg-perigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center`}>
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </div>
            {!sidebarColapsada && 'Notificações'}
          </NavLink>

          {/* Divisor */}
          <div className="h-px bg-borda w-full my-1"></div>

          {/* Perfil e Logout */}
          <div className="flex flex-col gap-2">
            <div className={`flex items-center ${sidebarColapsada ? 'justify-center px-0' : 'gap-3 px-4'} py-2`}>
              {renderAvatar('md')}
              {!sidebarColapsada && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate text-texto-primario">{usuario?.nome}</p>
                  <p className="text-xs text-texto-secundario truncate">{usuario?.email}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className={`flex items-center ${sidebarColapsada ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl w-full text-perigo-400 hover:bg-perigo-500/10 transition-all font-medium`}
              title="Sair"
            >
              <LogOut size={20} />
              {!sidebarColapsada && 'Sair'}
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Bottom Nav Mobile ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong z-50 px-2 py-1 safe-area-inset-bottom">
        <div className="flex justify-around items-center">
          <NavLink to="/" className={mobileLinkClasses} end>
            <Home size={22} />
            <span>Início</span>
          </NavLink>
          <NavLink to="/encontrei" className={mobileLinkClasses}>
            <PlusCircle size={22} />
            <span>Encontrei</span>
          </NavLink>
          <NavLink to="/matches" className={mobileLinkClasses}>
            <Handshake size={22} />
            <span>Matches</span>
          </NavLink>
          <NavLink to="/chat" className={mobileLinkClasses}>
            <MessageCircle size={22} />
            <span>Chat</span>
          </NavLink>
          <NavLink to="/perfil" className={mobileLinkClasses}>
            <div className="relative">
              {usuario?.avatar ? (
                <img 
                  src={`${BASE_URL}${usuario.avatar}`} 
                  alt={usuario.nome} 
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User size={22} />
              )}
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-perigo-500 rounded-full"></span>
              )}
            </div>
            <span>Perfil</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
