// Matches — Tela de correspondências com scores

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../servicos/api';
import IndicadorMatch from '../componentes/IndicadorMatch';
import { Handshake, ArrowRight, Check, Loader, Sparkles } from 'lucide-react';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [meusItens, setMeusItens] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [matchesItem, setMatchesItem] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [buscandoMatch, setBuscandoMatch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resMatches, resItens] = await Promise.all([
        api.get('/matching'),
        api.get('/itens/usuario/meus')
      ]);
      setMatches(resMatches.data.matches);
      setMeusItens(resItens.data.itens?.filter(i => i.status === 'ATIVO') || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  };

  const buscarMatchesParaItem = async (item) => {
    setItemSelecionado(item);
    setBuscandoMatch(true);
    try {
      const res = await api.get(`/matching/${item.id}`);
      setMatchesItem(res.data.matches);
    } catch (err) {
      console.error('Erro ao buscar matches:', err);
    } finally {
      setBuscandoMatch(false);
    }
  };

  const confirmarMatch = async (matchId) => {
    try {
      await api.post(`/matching/${matchId}/confirmar`);
      alert('🎉 Match confirmado! O item foi marcado como devolvido.');
      carregarDados();
      setItemSelecionado(null);
      setMatchesItem([]);
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao confirmar match');
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-2 flex items-center gap-3">
          <Sparkles size={32} /> Matches
        </h1>
        <p className="text-texto-secundario">
          Encontre correspondências entre itens perdidos e encontrados
        </p>
      </div>

      {/* Meus itens ativos */}
      {meusItens.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">🔍 Buscar matches para seus itens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meusItens.map(item => (
              <button
                key={item.id}
                onClick={() => buscarMatchesParaItem(item)}
                className={`card text-left flex items-center gap-4 ${
                  itemSelecionado?.id === item.id ? 'border-primary-500' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  item.tipo === 'PERDIDO' ? 'bg-perigo-500/20' : 'bg-acento-500/20'
                }`}>
                  {item.tipo === 'PERDIDO' ? '❓' : '✅'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.titulo}</p>
                  <p className="text-sm text-texto-secundario">
                    {item.tipo === 'PERDIDO' ? 'Perdido' : 'Encontrado'} • {item.local}
                  </p>
                </div>
                <ArrowRight size={18} className="text-texto-secundario" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados do match */}
      {itemSelecionado && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            🤖 Correspondências para "{itemSelecionado.titulo}"
          </h2>

          {buscandoMatch ? (
            <div className="flex items-center gap-3 py-10 justify-center text-texto-secundario">
              <Loader size={24} className="animate-spin" />
              <span>Analisando correspondências com IA...</span>
            </div>
          ) : matchesItem.length === 0 ? (
            <div className="text-center py-10">
              <Handshake size={48} className="mx-auto text-texto-secundario opacity-30 mb-3" />
              <p className="text-texto-secundario">Nenhuma correspondência encontrada ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matchesItem.map((resultado, i) => {
                const itemMatch = resultado.itemEncontrado || resultado.itemPerdido;
                return (
                  <div key={i} className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg truncate">{itemMatch?.titulo}</h3>
                        <IndicadorMatch score={resultado.score} />
                      </div>
                      <p className="text-sm text-texto-secundario line-clamp-2 mb-2">
                        {itemMatch?.descricao}
                      </p>
                      <p className="text-xs text-texto-secundario">
                        📍 {itemMatch?.local} • 👤 {itemMatch?.usuario?.nome}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/chat/${itemMatch?.usuario?.id}`)}
                        className="btn-secondary text-sm"
                      >
                        💬 Conversar
                      </button>
                      <button
                        onClick={() => {
                          const matchObj = matches.find(m =>
                            (m.itemPerdidoId === itemSelecionado.id && m.itemEncontradoId === itemMatch?.id) ||
                            (m.itemEncontradoId === itemSelecionado.id && m.itemPerdidoId === itemMatch?.id)
                          );
                          if (matchObj) confirmarMatch(matchObj.id);
                        }}
                        className="btn-primary text-sm"
                      >
                        <Check size={16} /> Esse é meu!
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Matches existentes */}
      {matches.length > 0 && !itemSelecionado && (
        <div>
          <h2 className="text-xl font-bold mb-4">📋 Seus matches anteriores</h2>
          <div className="space-y-4">
            {matches.map(match => (
              <div key={match.id} className="card flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{match.itemPerdido?.titulo}</span>
                    <ArrowRight size={16} className="text-primary-400" />
                    <span className="font-semibold">{match.itemEncontrado?.titulo}</span>
                  </div>
                  <IndicadorMatch score={match.score} />
                </div>
                {match.confirmado && (
                  <span className="text-acento-400 font-bold text-sm flex items-center gap-1">
                    <Check size={16} /> Confirmado
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && meusItens.length === 0 && (
        <div className="text-center py-20">
          <Handshake size={64} className="mx-auto text-texto-secundario opacity-30 mb-4" />
          <p className="text-texto-secundario text-lg">Nenhum match ainda</p>
          <p className="text-texto-secundario text-sm mt-1">
            Cadastre um item perdido ou encontrado para começar
          </p>
        </div>
      )}
    </div>
  );
}
