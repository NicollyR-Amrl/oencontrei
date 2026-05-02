// EditarItem — Página para editar um item existente
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../shared/servicos/api';
import FormularioItem from './FormularioItem';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function EditarItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarItem = async () => {
      try {
        const res = await api.get(`/itens/${id}`);
        setItem(res.data.item);
      } catch (err) {
        alert('Erro ao carregar item');
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
      await api.put(`/itens/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSucesso(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao atualizar item');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center">
          <CheckCircle size={80} className="mx-auto text-acento-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Item atualizado com sucesso!</h2>
          <p className="text-texto-secundario">Redirecionando...</p>
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
        <h1 className="text-3xl font-extrabold gradient-text mb-2">✏️ Editar Item</h1>
        <p className="text-texto-secundario">Atualize as informações do seu item</p>
      </div>

      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <FormularioItem 
          tipo={item.tipo} 
          onSubmit={handleSubmit} 
          carregando={salvando} 
          initialData={item}
        />
      </div>
    </div>
  );
}
