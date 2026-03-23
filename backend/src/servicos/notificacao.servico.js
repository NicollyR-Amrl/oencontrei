// Serviço de Notificações
// Cria e gerencia notificações para os usuários

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Criar notificação para um usuário
 */
async function criarNotificacao({ usuarioId, titulo, mensagem, tipo, io }) {
  const notificacao = await prisma.notificacao.create({
    data: {
      usuarioId,
      titulo,
      mensagem,
      tipo // 'match', 'mensagem', 'sistema'
    }
  });

  // Enviar em tempo real via Socket.io se disponível
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
