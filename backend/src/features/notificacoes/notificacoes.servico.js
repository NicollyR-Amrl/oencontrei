// Feature: Notificações — Serviço
// Cria e gerencia notificações para os usuários

const prisma = require('../../shared/prisma');

/**
 * Criar notificação para um usuário
 */
async function criarNotificacao({ usuarioId, titulo, mensagem, tipo, io }) {
  const notificacao = await prisma.notificacao.create({
    data: { usuarioId, titulo, mensagem, tipo }
  });

  if (io) {
    io.to(usuarioId).emit('nova_notificacao', {
      id: notificacao.id,
      titulo,
      mensagem,
      tipo,
      criadoEm: notificacao.criadoEm
    });
  }

  return notificacao;
}

/**
 * Notificar sobre um novo match encontrado
 */
async function notificarMatch({ usuarioId, itemTitulo, score, io }) {
  return criarNotificacao({
    usuarioId,
    titulo: '🎯 Possível match encontrado!',
    mensagem: `Encontramos um possível match para "${itemTitulo}" com ${score}% de compatibilidade.`,
    tipo: 'match',
    io
  });
}

module.exports = { criarNotificacao, notificarMatch };
