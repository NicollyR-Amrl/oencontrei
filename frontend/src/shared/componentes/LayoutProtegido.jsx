// LayoutProtegido — Wrapper com autenticação + barra de navegação

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/autenticacao/useAuth';
import { useUIStore } from '../stores/useUIStore';
import BarraNavegacao from './BarraNavegacao';

export default function LayoutProtegido() {
  const { autenticado, carregando } = useAuth();
  const { sidebarColapsada } = useUIStore();

  if (carregando) return null;

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="w-full min-h-screen">
      {/* Sidebar desktop */}
      <BarraNavegacao />

      {/* Conteúdo principal */}
      <main className={`pb-20 md:pb-0 ${sidebarColapsada ? 'md:pl-20' : 'md:pl-64'} min-h-screen w-full transition-all duration-300 ease-in-out`}>
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
