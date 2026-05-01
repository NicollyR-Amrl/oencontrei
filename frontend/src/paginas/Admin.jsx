// Admin.jsx — Layout Administrativo com Roteamento Aninhado

import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, LayoutDashboard, Package, Users, Settings } from 'lucide-react';

export default function Admin() {
  const { usuario } = useAuth();

  // Proteção rígida de rota: redirecionar alunos para home
  if (usuario?.cargo !== 'ADMIN') {
    return <Navigate to="/" replace />;
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
          <Shield size={28} className="text-primary-500" /> Administração
        </h1>
        
        <nav className="flex items-center p-1 bg-white rounded-xl overflow-x-auto no-scrollbar border border-borda shadow-sm">
          {abas.map((aba) => (
            <NavLink
              key={aba.caminho}
              to={`/admin/${aba.caminho}`}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'text-texto-secundario hover:text-primary-600 hover:bg-primary-50'}
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
