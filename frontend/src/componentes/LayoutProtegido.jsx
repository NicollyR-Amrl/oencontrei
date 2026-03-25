// LayoutProtegido — Wrapper com autenticação + barra de navegação

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarraNavegacao from './BarraNavegacao';

export default function LayoutProtegido() {
  const { autenticado, carregando } = useAuth();

  if (carregando) return null;

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Sidebar desktop */}
      <BarraNavegacao />

      {/* Conteúdo principal */}
      <main className="flex-1 pb-20 md:pb-0 md:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
