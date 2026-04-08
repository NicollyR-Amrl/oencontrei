// Admin.jsx — Layout Administrativo com Roteamento Aninhado

import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, LayoutDashboard, Package, Users, Settings } from 'lucide-react';

export default function Admin() {
  const { usuario } = useAuth();

  // Proteção de rota interna (além do LayoutProtegido)
  if (usuario?.cargo !== 'ADMIN') {
    return (
      <div className="text-center py-20 animate-fade-in">
        <Shield size={64} className="mx-auto text-perigo-400 opacity-30 mb-4" />
        <p className="text-perigo-400 text-lg font-bold">Acesso negado</p>
        <p className="text-texto-secundario mt-2">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  const abas = [
    { caminho: 'dashboard', label: 'Dashboard', icone: LayoutDashboard },
    { caminho: 'itens', label: 'Gerenciar Itens', icone: Package },
    { caminho: 'usuarios', label: 'Usuários', icone: Users },
    { caminho: 'configuracoes', label: 'Configurações', icone: Settings },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold gradient-text flex items-center gap-3">
          <Shield size={28} /> Administração
        </h1>
        
        <nav className="flex items-center p-1 glass-strong rounded-xl overflow-x-auto no-scrollbar">
          {abas.map((aba) => (
            <NavLink
              key={aba.caminho}
              to={`/admin/${aba.caminho}`}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-texto-secundario hover:text-texto-primario hover:bg-white/5'}
              `}
            >
              <aba.icone size={16} />
              {aba.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="min-h-[400px]">
        {/* Renderiza a aba ativa aqui */}
        <Outlet />
      </main>
    </div>
  );
}
