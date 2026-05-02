// BarraNavegacao — Sidebar (desktop) + Bottom Nav (mobile)

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotificacoes } from '../hooks/useNotificacoes';
import {
  Home, PlusCircle, AlertCircle, Handshake, MessageCircle,
  User, Shield, LogOut, PackageSearch, ChevronRight
} from 'lucide-react';

export default function BarraNavegacao() {
  const { usuario, logout } = useAuth();
  const { naoLidas } = useNotificacoes();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Desktop sidebar link
  const SidebarLink = ({ to, icon: Icon, label, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-primary-500 text-white shadow-md'
            : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
        }`
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  // Mobile bottom nav link  
  const MobileLink = ({ to, icon: Icon, label, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
          isActive ? 'text-primary-600' : 'text-slate-400'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1 rounded-lg ${isActive ? 'bg-primary-50' : ''}`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
          </div>
          <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* ===== SIDEBAR DESKTOP ===== */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50 bg-white border-r border-slate-100"
        style={{ width: '280px' }}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg"
              style={{ width: '44px', height: '44px' }}
            >
              <PackageSearch size={22} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 leading-tight">O Encontrei!</h1>
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Achados & Perdidos</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 mb-4"><div className="h-px bg-slate-100"></div></div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-4 mb-2">Menu</p>
          
          <SidebarLink to="/" icon={Home} label="Início" end />
          <SidebarLink to="/encontrei" icon={PlusCircle} label="Achei algo" />
          <SidebarLink to="/perdi" icon={AlertCircle} label="Perdi algo" />

          <div className="py-3 px-4"><div className="h-px bg-slate-100"></div></div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-4 mb-2">Social</p>

          <SidebarLink to="/matches" icon={Handshake} label="Matches" />
          <SidebarLink to="/chat" icon={MessageCircle} label="Mensagens" />

          {usuario?.cargo === 'ADMIN' && (
            <>
              <div className="py-3 px-4"><div className="h-px bg-slate-100"></div></div>
              <SidebarLink to="/admin" icon={Shield} label="Painel Admin" />
            </>
          )}
        </nav>

        {/* Profile Card */}
        <div className="p-4 border-t border-slate-100">
          <NavLink
            to="/perfil"
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 transition-colors group mb-2"
          >
            <div className="relative shrink-0">
              <div
                className="rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md"
                style={{ width: '40px', height: '40px', fontSize: '14px' }}
              >
                {usuario?.nome?.charAt(0)?.toUpperCase()}
              </div>
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white" style={{ width: '18px', height: '18px', fontSize: '9px', fontWeight: 700 }}>
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-700 truncate group-hover:text-primary-600 transition-colors">
                {usuario?.nome?.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Meu perfil</p>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-400 transition-colors shrink-0" />
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-400 text-sm font-semibold hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={16} />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* ===== BOTTOM NAV MOBILE ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center" style={{ height: '64px' }}>
          <MobileLink to="/" icon={Home} label="Início" end />
          <MobileLink to="/encontrei" icon={PlusCircle} label="Achei" />
          <MobileLink to="/matches" icon={Handshake} label="Match" />
          <MobileLink to="/chat" icon={MessageCircle} label="Chat" />
          <MobileLink to="/perfil" icon={User} label="Perfil" />
        </div>
      </nav>
    </>
  );
}
