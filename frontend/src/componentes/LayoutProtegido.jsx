// LayoutProtegido — Wrapper com autenticação + barra de navegação

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarraNavegacao from './BarraNavegacao';
import TermosDeUsoModal from './TermosDeUsoModal';

export default function LayoutProtegido() {
  const { autenticado, carregando, usuario } = useAuth();

  if (carregando) return null;

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <BarraNavegacao />
      <MainContent />
      {usuario && !usuario.termosAceitos && <TermosDeUsoModal />}
    </div>
  );
}

// Separate component with spacious responsive layout
function MainContent() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .main-content {
          min-height: 100vh;
          padding-bottom: 96px;
          background: #f8fafc;
        }
        @media (min-width: 768px) {
          .main-content {
            margin-left: 280px;
            padding-bottom: 48px;
          }
        }
        .main-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 32px;
        }
        @media (max-width: 767px) {
          .main-inner {
            padding: 20px 16px;
          }
        }
      `}} />
      <main className="main-content">
        <div className="main-inner">
          <Outlet />
        </div>
      </main>
    </>
  );
}
