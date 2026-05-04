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
    <div className="min-h-screen bg-fundo-escuro">
      <BarraNavegacao />
      <MainContent />
    </div>
  );
}

// Separate component so we can use media query logic cleanly
function MainContent() {
  // Use CSS-in-JS for the sidebar offset since Tailwind v4 arbitrary values may not work
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .main-content {
          min-height: 100vh;
          padding-bottom: 96px;
        }
        @media (min-width: 768px) {
          .main-content {
            margin-left: 280px;
            padding-bottom: 32px;
          }
        }
      `}} />
      <main className="main-content">
        <div className="px-5 sm:px-8 lg:px-10 py-6">
          <Outlet />
        </div>
      </main>
    </>
  );
}
