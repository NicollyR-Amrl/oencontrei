// Feature: Notificações — Controlador

const prisma = require('../../shared/prisma');

/**
 * Listar notificações do usuário
 * GET /api/notificacoes
 */
const listarNotificacoes = async (req, res) => {
  try {
    const notificacoes = await prisma.notificacao.findMany({
      where: { usuarioId: req.usuario.id },
      orderBy: { criadoEm: 'desc' },
      take: 50
    });

    const naoLidas = notificacoes.filter(n => !n.lida).length;
    res.json({ sucesso: true, notificacoes, naoLidas });
  } catch (erro) {
    console.error('Erro ao listar notificações:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar notificações' });
  }
};

/**
 * Marcar notificação como lida
 * PUT /api/notificacoes/:id/lida
 */
const marcarComoLida = async (req, res) => {
  try {
    await prisma.notificacao.update({
      where: { id: req.params.id },
      data: { lida: true }
    });

    res.json({ sucesso: true, mensagem: 'Notificação marcada como lida' });
  } catch (erro) {
    console.error('Erro ao marcar notificação:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao marcar notificação como lida' });
  }
};

/**
 * Marcar todas como lidas
 * PUT /api/notificacoes/todas-lidas
 */
const marcarTodasComoLidas = async (req, res) => {
  try {
    await prisma.notificacao.updateMany({
      where: { usuarioId: req.usuario.id, lida: false },
      data: { lida: true }
    });

    res.json({ sucesso: true, mensagem: 'Todas as notificações marcadas como lidas' });
  } catch (erro) {
    console.error('Erro ao marcar notificações:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao marcar notificações' });
  }
};

module.exports = { listarNotificacoes, marcarComoLida, marcarTodasComoLidas };
