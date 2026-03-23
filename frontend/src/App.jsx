// App.jsx — Roteador principal e layout

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import BarraNavegacao from './componentes/BarraNavegacao';
import LayoutProtegido from './componentes/LayoutProtegido';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import Inicio from './paginas/Inicio';
import CadastroItemEncontrado from './paginas/CadastroItemEncontrado';
import CadastroItemPerdido from './paginas/CadastroItemPerdido';
import Matches from './paginas/Matches';
import Chat from './paginas/Chat';
import Perfil from './paginas/Perfil';
import Admin from './paginas/Admin';

export default function App() {
  const { carregando } = useAuth();

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
    <div className="min-h-screen flex flex-col md:flex-row">
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
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
