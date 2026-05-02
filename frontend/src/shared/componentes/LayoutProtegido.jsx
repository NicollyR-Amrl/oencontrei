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
    <div className="flex min-h-screen bg-fundo-escuro">
      {/* Sidebar desktop - Fixa na lateral esquerda */}
      <div className={`hidden md:block transition-all duration-300 ease-in-out ${sidebarColapsada ? 'w-20' : 'w-64'}`}>
        <BarraNavegacao />
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 w-full min-h-screen flex flex-col">
        {/* Espaçamento para o Bottom Nav no mobile */}
        <div className="flex-1 pb-24 md:pb-8 pt-8 md:pt-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
