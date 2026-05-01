// FormularioItem — Formulário reutilizável para cadastrar item (encontrado ou perdido)

import { useState } from 'react';
import { Upload, MapPin, Tag, FileText, Image } from 'lucide-react';

const CATEGORIAS = [
  { valor: 'ELETRONICO', label: '📱 Eletrônico' },
  { valor: 'ROUPA', label: '👕 Roupa' },
  { valor: 'MATERIAL_ESCOLAR', label: '📚 Material Escolar' },
  { valor: 'ACESSORIO', label: '💍 Acessório' },
  { valor: 'DOCUMENTO', label: '📄 Documento' },
  { valor: 'CHAVE', label: '🔑 Chave' },
  { valor: 'GARRAFA', label: '🧴 Garrafa' },
  { valor: 'OUTRO', label: '📦 Outro' },
];

export default function FormularioItem({ tipo, onSubmit, carregando }) {
  const [formulario, setFormulario] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    local: '',
    data: new Date().toISOString().split('T')[0],
  });
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  const handleChange = (e) => {
    setFormulario(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setPreviewImagem(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dados = new FormData();
    dados.append('titulo', formulario.titulo);
    dados.append('descricao', formulario.descricao);
    dados.append('categoria', formulario.categoria);
    dados.append('tipo', tipo);
    dados.append('local', formulario.local);
    dados.append('data', formulario.data);
    if (imagem) {
      dados.append('imagem', imagem);
    }
    onSubmit(dados);
  };

  const ehPerdido = tipo === 'PERDIDO';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload de imagem */}
      <div>
        <label className="block text-sm font-medium mb-2 text-texto-secundario">
          <Image size={16} className="inline mr-2" /> Foto do Item
        </label>
        <div className="relative">
          {previewImagem ? (
            <div className="relative rounded-xl overflow-hidden aspect-video mb-2 border border-borda">
              <img src={previewImagem} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setImagem(null); setPreviewImagem(null); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-perigo-500 hover:bg-perigo-500 hover:text-white transition-all shadow-md"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all bg-white">
              <Upload size={32} className="text-primary-300 mb-2" />
              <span className="text-texto-secundario text-sm font-medium">Clique para enviar uma foto</span>
              <span className="text-texto-secundario text-xs mt-1">JPEG, PNG, WebP (max 5MB)</span>
              <input type="file" accept="image/*" onChange={handleImagem} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium mb-2 text-texto-secundario">
          <FileText size={16} className="inline mr-2" /> Título
        </label>
        <input
          type="text"
          name="titulo"
          value={formulario.titulo}
          onChange={handleChange}
          placeholder={ehPerdido ? 'Ex: Estojo azul com zíper' : 'Ex: Celular Samsung encontrado'}
          className="input-field"
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium mb-2 text-texto-secundario">
          Descrição detalhada
        </label>
        <textarea
          name="descricao"
          value={formulario.descricao}
          onChange={handleChange}
          placeholder="Descreva o item com o máximo de detalhes possível (cor, marca, tamanho, marcas de identificação...)"
          rows={4}
          className="input-field resize-none"
          required
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium mb-2 text-texto-secundario">
          <Tag size={16} className="inline mr-2" /> Categoria
        </label>
        <select
          name="categoria"
          value={formulario.categoria}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Selecione uma categoria</option>
          {CATEGORIAS.map(cat => (
            <option key={cat.valor} value={cat.valor}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Local */}
      <div>
        <label className="block text-sm font-medium mb-2 text-texto-secundario">
          <MapPin size={16} className="inline mr-2" /> Local
        </label>
        <input
          type="text"
          name="local"
          value={formulario.local}
          onChange={handleChange}
          placeholder="Ex: Sala 301, Pátio, Biblioteca, Cantina..."
          className="input-field"
          required
        />
      </div>

      {/* Data */}
      <div>
        <label className="block text-sm font-medium mb-2 text-texto-secundario">
          📅 Data
        </label>
        <input
          type="date"
          name="data"
          value={formulario.data}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      {/* Botão submeter */}
      <button
        type="submit"
        disabled={carregando}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          ehPerdido
            ? 'btn-danger'
            : 'btn-primary'
        }`}
      >
        {carregando
          ? '⏳ Cadastrando...'
          : ehPerdido
            ? '❗ Registrar Item Perdido'
            : '✅ Registrar Item Encontrado'
        }
      </button>
    </form>
  );
}
