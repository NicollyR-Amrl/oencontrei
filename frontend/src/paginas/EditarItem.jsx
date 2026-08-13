// EditarItem — Página para editar uma publicação existente

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../servicos/api';
import FormularioItem from '../componentes/FormularioItem';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

export default function EditarItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarItem = async () => {
      try {
        const res = await api.get(`/itens/${id}`);
        setItem(res.data.item);
      } catch (err) {
        console.error('Erro ao carregar item:', err);
        alert('Erro ao carregar os dados do item');
        navigate('/');
      } finally {
        setCarregando(false);
      }
    };
    carregarItem();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSalvando(true);
    try {
      await api.put(`/itens/${id}`, formData);
      alert('Publicação atualizada com sucesso!');
      navigate(`/item/${id}`);
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      alert(err.response?.data?.mensagem || 'Erro ao atualizar publicação');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
        <p className="text-texto-secundario font-medium">Carregando dados do item...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-texto-secundario hover:text-primary-600 mb-6 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span>Voltar</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold gradient-text mb-2">✏️ Editar Publicação</h1>
        <p className="text-texto-secundario">Atualize as informações do seu item para que outros possam identificá-lo melhor</p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-borda">
        <FormularioItem 
          initialData={item} 
          onSubmit={handleSubmit} 
          carregando={salvando} 
        />
      </div>
    </div>
  );
}
