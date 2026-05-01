// BarraNavegacao — Sidebar (desktop) + Bottom Nav (mobile)

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotificacoes } from '../hooks/useNotificacoes';
import {
  Home, Search, PlusCircle, AlertTriangle, Handshake, MessageCircle,
  Bell, User, Shield, LogOut
} from 'lucide-react';

export default function BarraNavegacao() {
  const { usuario, logout } = useAuth();
  const { naoLidas } = useNotificacoes();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-primary-100 text-primary-700 font-semibold'
        : 'text-texto-secundario hover:text-primary-600 hover:bg-primary-50'
    }`;

  const mobileLinkClasses = ({ isActive }) =>
    `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 text-xs ${
      isActive
        ? 'text-primary-600 font-semibold'
        : 'text-texto-secundario'
    }`;

  return (
    <>
      {/* ===== Sidebar Desktop ===== */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-borda z-50 p-6 shadow-sm">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold gradient-text">O Encontrei!</h1>
          <p className="text-sm text-texto-secundario mt-1">Achados & Perdidos</p>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1">
          <NavLink to="/" className={linkClasses} end>
            <Home size={20} /> Início
          </NavLink>
          <NavLink to="/encontrei" className={linkClasses}>
            <PlusCircle size={20} /> Encontrei Item
          </NavLink>
          <NavLink to="/perdi" className={linkClasses}>
            <AlertTriangle size={20} /> Perdi Item
          </NavLink>
          <NavLink to="/matches" className={linkClasses}>
            <Handshake size={20} /> Matches
          </NavLink>
          <NavLink to="/chat" className={linkClasses}>
            <MessageCircle size={20} /> Chat
          </NavLink>
          <NavLink to="/perfil" className={linkClasses}>
            <User size={20} /> Perfil
          </NavLink>

          {usuario?.cargo === 'ADMIN' && (
            <NavLink to="/admin" className={linkClasses}>
              <Shield size={20} /> Admin
            </NavLink>
          )}
        </nav>

        {/* Notificações */}
        <div className="mb-4">
          <NavLink to="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-texto-secundario hover:text-primary-600 hover:bg-primary-50 transition-all">
            <div className="relative">
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-perigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </div>
            Notificações
          </NavLink>
        </div>

        {/* Perfil e Logout */}
        <div className="border-t border-borda pt-4">
          <div className="flex items-center gap-3 px-4 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white">
              {usuario?.nome?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{usuario?.nome}</p>
              <p className="text-xs text-texto-secundario truncate">{usuario?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-perigo-500 hover:bg-perigo-500/10 transition-all"
          >
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* ===== Bottom Nav Mobile ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-borda z-50 px-2 py-1 safe-area-inset-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
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
              <User size={22} />
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
