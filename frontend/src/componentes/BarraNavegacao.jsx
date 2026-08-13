// BarraNavegacao — Sidebar flutuante (desktop) + Bottom Nav (mobile)

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotificacoes } from '../hooks/useNotificacoes';
import {
  Home, PlusCircle, AlertCircle, Handshake, MessageCircle,
  User, Shield, LogOut, PackageSearch, ChevronRight, Bell
} from 'lucide-react';

export default function BarraNavegacao() {
  const { usuario, logout } = useAuth();
  const { naoLidas } = useNotificacoes();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarLink = ({ to, icon: Icon, label, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
          isActive
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
            isActive ? 'bg-white/20' : 'group-hover:bg-slate-100'
          }`}>
            <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  const MobileLink = ({ to, icon: Icon, label, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
          isActive ? 'text-primary-600' : 'text-slate-400'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-50' : ''}`}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
          </div>
          <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* ===== SIDEBAR DESKTOP FLUTUANTE ===== */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50"
        style={{ width: '280px', padding: '16px 12px' }}
      >
        <div
          className="flex flex-col flex-1 rounded-2xl overflow-hidden"
          style={{
            background: 'white',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
            border: '1px solid rgba(226,232,240,0.8)',
          }}
        >
          {/* Logo */}
          <div style={{ padding: '20px 20px 14px' }}>
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 shrink-0"
                style={{ width: '42px', height: '42px' }}
              >
                <PackageSearch size={20} />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-800 leading-tight">O Encontrei!</h1>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Achados & Perdidos</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '0 16px 12px' }}>
            <div className="h-px bg-slate-100"></div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto" style={{ padding: '0 12px' }}>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2" style={{ padding: '0 12px' }}>Principal</p>

            <div className="space-y-1">
              <SidebarLink to="/" icon={Home} label="Início" end />
              <SidebarLink to="/encontrei" icon={PlusCircle} label="Achei algo" />
              <SidebarLink to="/perdi" icon={AlertCircle} label="Perdi algo" />
            </div>

            <div style={{ padding: '12px 12px', margin: '4px 0' }}>
              <div className="h-px bg-slate-100"></div>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2" style={{ padding: '0 12px' }}>Social</p>

            <div className="space-y-1">
              <SidebarLink to="/matches" icon={Handshake} label="Matches" />
              <SidebarLink to="/chat" icon={MessageCircle} label="Mensagens" />
            </div>

            {usuario?.cargo === 'ADMIN' && (
              <>
                <div style={{ padding: '12px 12px', margin: '4px 0' }}>
                  <div className="h-px bg-slate-100"></div>
                </div>
                <div className="space-y-1">
                  <SidebarLink to="/admin" icon={Shield} label="Painel Admin" />
                </div>
              </>
            )}
          </nav>

          {/* Profile Card */}
          <div style={{ padding: '12px 12px', borderTop: '1px solid #f1f5f9' }}>
            <NavLink
              to="/perfil"
              className="flex items-center gap-3 rounded-xl bg-slate-50 hover:bg-primary-50 transition-all duration-200 group relative overflow-hidden"
              style={{ padding: '10px 14px', marginBottom: '8px' }}
            >
              <div className="relative shrink-0">
                {usuario?.avatar ? (
                  <img
                    src={usuario.avatar}
                    alt={usuario.nome}
                    className="rounded-full object-cover ring-2 ring-white shadow-sm"
                    style={{ width: '38px', height: '38px' }}
                  />
                ) : (
                  <div
                    className="rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md"
                    style={{ width: '38px', height: '38px', fontSize: '15px' }}
                  >
                    {usuario?.nome?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                {naoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white" style={{ width: '16px', height: '16px', fontSize: '8px', fontWeight: 700 }}>
                    {naoLidas > 9 ? '9+' : naoLidas}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-700 truncate group-hover:text-primary-600 transition-colors leading-tight">
                  {usuario?.nome?.split(' ')[0]}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Meu perfil</p>
              </div>
              <ChevronRight size={15} className="text-slate-300 group-hover:text-primary-400 transition-colors shrink-0" />
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full rounded-xl text-slate-400 text-sm font-semibold hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              style={{ padding: '10px 14px' }}
            >
              <LogOut size={15} />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===== BOTTOM NAV MOBILE ===== */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'white',
          borderTop: '1px solid #f1f5f9',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
        }}
      >
        <div className="flex items-center" style={{ height: '64px', padding: '0 8px' }}>
          <MobileLink to="/" icon={Home} label="Início" end />
          <MobileLink to="/encontrei" icon={PlusCircle} label="Achei" />
          <MobileLink to="/matches" icon={Handshake} label="Match" />
          <MobileLink to="/chat" icon={MessageCircle} label="Chat" />
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
                isActive ? 'text-primary-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-50' : ''}`}>
                  {usuario?.avatar ? (
                    <img src={usuario.avatar} alt="Perfil" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  )}
                </div>
                <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>Perfil</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </>
  );
}
