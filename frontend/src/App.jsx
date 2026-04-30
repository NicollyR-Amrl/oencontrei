// App.jsx — Roteador principal e layout

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/autenticacao/useAuth';
import BarraNavegacao from './shared/componentes/BarraNavegacao';
import LayoutProtegido from './shared/componentes/LayoutProtegido';
import Login from './features/autenticacao/Login';
import Cadastro from './features/autenticacao/Cadastro';
import Inicio from './features/itens/Inicio';
import CadastroItemEncontrado from './features/itens/CadastroItemEncontrado';
import CadastroItemPerdido from './features/itens/CadastroItemPerdido';
import EditarItem from './features/itens/EditarItem';
import Matches from './features/matches/Matches';
import Chat from './features/chat/Chat';
import Perfil from './features/perfil/Perfil';
import Admin from './features/admin/Admin';

export default function App() {
  const { carregando, verificarAuth } = useAuth();
  
  useEffect(() => {
    verificarAuth();
  }, [verificarAuth]);

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-texto-secundario text-lg">Carregando O Encontrei!...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fundo-escuro text-texto-primario relative">
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas */}
        <Route element={<LayoutProtegido />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/encontrei" element={<CadastroItemEncontrado />} />
          <Route path="/perdi" element={<CadastroItemPerdido />} />
          <Route path="/editar-item/:id" element={<EditarItem />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:usuarioId" element={<Chat />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
