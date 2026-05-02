// CadastroItemPerdido — Registrar item perdido

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../shared/servicos/api';
import FormularioItem from './FormularioItem';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function CadastroItemPerdido() {
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setCarregando(true);
    try {
      await api.post('/itens', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSucesso(true);
      setTimeout(() => navigate('/matches'), 2000);
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.detalhes && Array.isArray(resp.detalhes)) {
        alert(`${resp.mensagem}:\n- ${resp.detalhes.join('\n- ')}`);
      } else {
        alert(resp?.mensagem || 'Erro ao cadastrar item');
      }
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center">
          <CheckCircle size={80} className="mx-auto text-acento-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Item perdido registrado!</h2>
          <p className="text-texto-secundario">Vamos buscar correspondências para você...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-texto-secundario hover:text-primary-400 mb-6 transition-colors">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">
          <span className="text-perigo-400">❗ Perdi um Item</span>
        </h1>
        <p className="text-texto-secundario">Descreva o item que você perdeu. Nosso sistema de IA vai buscar correspondências automaticamente.</p>
      </div>

      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <FormularioItem tipo="PERDIDO" onSubmit={handleSubmit} carregando={carregando} />
      </div>
    </div>
  );
}
