// App.jsx — Roteador principal com Lazy Loading e Nested Routing

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LayoutProtegido from './componentes/LayoutProtegido';

// Lazy Loading das páginas
const Login = lazy(() => import('./paginas/Login'));
const Cadastro = lazy(() => import('./paginas/Cadastro'));
const Inicio = lazy(() => import('./paginas/Inicio'));
const CadastroItemEncontrado = lazy(() => import('./paginas/CadastroItemEncontrado'));
const CadastroItemPerdido = lazy(() => import('./paginas/CadastroItemPerdido'));
const Matches = lazy(() => import('./paginas/Matches'));
const Chat = lazy(() => import('./paginas/Chat'));
const Perfil = lazy(() => import('./paginas/Perfil'));

// Admin e suas sub-rotas
const Admin = lazy(() => import('./paginas/Admin'));
const AdminDashboard = lazy(() => import('./paginas/admin/AdminDashboard'));
const AdminItens = lazy(() => import('./paginas/admin/AdminItens'));

// Componente de Loading Simples
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-texto-secundario text-lg">Carregando...</p>
    </div>
  </div>
);

export default function App() {
  const { carregando } = useAuth();

  if (carregando) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route element={<LayoutProtegido />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/encontrei" element={<CadastroItemEncontrado />} />
            <Route path="/perdi" element={<CadastroItemPerdido />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:usuarioId" element={<Chat />} />
            <Route path="/perfil" element={<Perfil />} />
            
            {/* Admin com Roteamento Aninhado */}
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="itens" element={<AdminItens />} />
              <Route path="usuarios" element={<div className="card text-center py-10 text-texto-secundario">Gerenciamento de Usuários em breve...</div>} />
              <Route path="configuracoes" element={<div className="card text-center py-10 text-texto-secundario">Configurações do Sistema em breve...</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
