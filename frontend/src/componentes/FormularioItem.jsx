// FormularioItem — Formulário reutilizável para cadastrar item (encontrado ou perdido)

import { useState } from 'react';
import { Upload, MapPin, Tag, FileText, Image as ImageIcon, Calendar, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORIAS = [
  { valor: 'ELETRONICO', label: 'Eletrônico', emoji: '📱' },
  { valor: 'ROUPA', label: 'Roupa', emoji: '👕' },
  { valor: 'MATERIAL_ESCOLAR', label: 'Material Escolar', emoji: '📚' },
  { valor: 'ACESSORIO', label: 'Acessório', emoji: '💍' },
  { valor: 'DOCUMENTO', label: 'Documento', emoji: '📄' },
  { valor: 'CHAVE', label: 'Chave', emoji: '🔑' },
  { valor: 'GARRAFA', label: 'Garrafa / Copo', emoji: '🧴' },
  { valor: 'OUTRO', label: 'Outro', emoji: '📦' },
];

export default function FormularioItem({ tipo, onSubmit, carregando, initialData }) {
  const [formulario, setFormulario] = useState({
    titulo: initialData?.titulo || '',
    descricao: initialData?.descricao || '',
    categoria: initialData?.categoria || '',
    local: initialData?.local || '',
    data: initialData?.criadoEm 
      ? new Date(initialData.criadoEm).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(initialData?.imagem || null);
  const [isDragging, setIsDragging] = useState(false);
  const [erroLocal, setErroLocal] = useState('');

  const handleChange = (e) => {
    setFormulario(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (erroLocal) setErroLocal('');
  };

  const processarArquivo = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErroLocal('Por favor, selecione apenas arquivos de imagem (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErroLocal('A imagem é muito grande. Tamanho máximo permitido: 5MB.');
      return;
    }
    setErroLocal('');
    setImagem(file);
    setPreviewImagem(URL.createObjectURL(file));
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    processarArquivo(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processarArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formulario.titulo.trim().length < 3) {
      setErroLocal('O título deve ter pelo menos 3 caracteres.');
      return;
    }
    if (formulario.descricao.trim().length < 10) {
      setErroLocal('A descrição deve ter pelo menos 10 caracteres para facilitar a identificação.');
      return;
    }
    if (!formulario.categoria) {
      setErroLocal('Por favor, selecione uma categoria.');
      return;
    }
    if (formulario.local.trim().length < 3) {
      setErroLocal('Especifique o local onde o item foi visto ou encontrado.');
      return;
    }

    setErroLocal('');
    const dados = new FormData();
    dados.append('titulo', formulario.titulo);
    dados.append('descricao', formulario.descricao);
    dados.append('categoria', formulario.categoria);
    dados.append('tipo', tipo || initialData?.tipo);
    dados.append('local', formulario.local);
    dados.append('data', formulario.data);
    if (imagem) {
      dados.append('imagem', imagem);
    }
    onSubmit(dados);
  };

  const ehPerdido = (tipo || initialData?.tipo) === 'PERDIDO';
  const ehEdicao = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erroLocal && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium animate-fade-in">
          <AlertCircle size={20} className="shrink-0 text-rose-500" />
          <span>{erroLocal}</span>
        </div>
      )}

      {/* Upload de imagem com Dropzone Moderno */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon size={18} className="text-primary-500" /> Foto do Item
          </span>
          <span className="text-xs text-slate-400 font-normal">Opcional • Máx 5MB</span>
        </label>

        <div className="relative">
          {previewImagem ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-md group bg-slate-900">
              <img 
                src={previewImagem.startsWith('blob:') ? previewImagem : previewImagem} 
                alt="Preview do item" 
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="cursor-pointer bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                  <ImageIcon size={14} /> Trocar foto
                  <input type="file" accept="image/*" onChange={handleImagem} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => { setImagem(null); setPreviewImagem(null); }}
                  className="bg-rose-500/90 hover:bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-lg backdrop-blur-sm flex items-center gap-1"
                >
                  <X size={14} /> Remover
                </button>
              </div>
            </div>
          ) : (
            <label 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full min-h-[180px] p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                isDragging 
                  ? 'border-primary-500 bg-primary-50/80 scale-[1.01]' 
                  : 'border-slate-200 bg-slate-50/50 hover:border-primary-400 hover:bg-white hover:shadow-lg hover:shadow-primary-500/5'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-100 to-cyan-50 flex items-center justify-center mb-3 text-primary-600 shadow-inner">
                <Upload size={26} className="animate-bounce" />
              </div>
              <p className="text-slate-800 text-sm font-bold mb-1">
                Arraste e solte uma imagem aqui ou <span className="text-primary-600 underline">clique para buscar</span>
              </p>
              <p className="text-slate-400 text-xs font-medium">Suporta arquivos PNG, JPG, GIF ou WebP (até 5MB)</p>
              <input type="file" accept="image/*" onChange={handleImagem} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <FileText size={18} className="text-primary-500" /> Título da Publicação
        </label>
        <input
          type="text"
          name="titulo"
          value={formulario.titulo}
          onChange={handleChange}
          placeholder={ehPerdido ? 'Ex: Casaco de frio Adidas preto' : 'Ex: Chaveiro com 3 chaves e fita azul'}
          className="input-field"
          required
        />
      </div>

      {/* Categorias Interativas */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-2">
          <Tag size={18} className="text-primary-500" /> Categoria
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIAS.map(cat => {
            const selecionada = formulario.categoria === cat.valor;
            return (
              <button
                type="button"
                key={cat.valor}
                onClick={() => setFormulario(prev => ({ ...prev, categoria: cat.valor }))}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs transition-all border text-left ${
                  selecionada
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20 scale-[1.02]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Descrição com contador de caracteres */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-slate-700">
            Descrição detalhada
          </label>
          <span className={`text-xs ${formulario.descricao.length < 10 ? 'text-rose-400 font-medium' : 'text-slate-400'}`}>
            {formulario.descricao.length}/10 min
          </span>
        </div>
        <textarea
          name="descricao"
          value={formulario.descricao}
          onChange={handleChange}
          placeholder="Descreva o item com o máximo de detalhes possível (cor principal, marca, manchas, chaveiro preso, ranhuras...)"
          rows={3}
          className="input-field resize-none"
          required
        />
      </div>

      {/* Grid: Local e Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <MapPin size={18} className="text-primary-500" /> Local
          </label>
          <input
            type="text"
            name="local"
            value={formulario.local}
            onChange={handleChange}
            placeholder="Ex: Biblioteca, Pátio central, Sala 204..."
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Calendar size={18} className="text-primary-500" /> Data do Ocorrido
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
      </div>

      {/* Botão Submeter */}
      <button
        type="submit"
        disabled={carregando}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          ehPerdido
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-rose-500/30 hover:scale-[1.01]'
            : 'bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 text-white hover:shadow-primary-500/30 hover:scale-[1.01]'
        }`}
      >
        {carregando ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>{ehEdicao ? 'Salvando alterações...' : 'Processando publicação...'}</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>
              {ehEdicao
                ? 'Salvar Alterações'
                : ehPerdido
                  ? 'Registrar Item Perdido'
                  : 'Registrar Item Encontrado'
              }
            </span>
          </>
        )}
      </button>
    </form>
  );
}
