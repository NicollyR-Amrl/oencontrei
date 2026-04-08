// Controlador de Matching
// Buscar e gerenciar correspondências entre itens

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { buscarMatches, buscarMatchesParaEncontrado } = require('../servicos/matching.servico');
const { notificarMatch } = require('../servicos/notificacao.servico');

/**
 * Buscar matches para um item perdido
 * GET /api/matching/:itemId
 */
const obterMatches = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await prisma.item.findUnique({ where: { id: itemId } });

    if (!item) {
      return res.status(404).json({ erro: true, mensagem: 'Item não encontrado' });
    }

    let resultados;
    if (item.tipo === 'PERDIDO') {
      resultados = await buscarMatches(itemId);
    } else {
      resultados = await buscarMatchesParaEncontrado(itemId);
    }

    // Notificar o dono do item se houver bons matches
    const io = req.app.get('io');
    const bonsMatches = resultados.filter(r => r.score >= 50);
    if (bonsMatches.length > 0) {
      await notificarMatch({
        usuarioId: item.usuarioId,
        itemTitulo: item.titulo,
        score: bonsMatches[0].score,
        io
      });
    }

    res.json({ sucesso: true, matches: resultados });
  } catch (erro) {
    console.error('Erro ao buscar matches:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao buscar correspondências' });
  }
};

/**
 * Listar todos os matches do usuário
 * GET /api/matching
 */
const listarMatchesUsuario = async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { itemPerdido: { usuarioId: req.usuario.id } },
          { itemEncontrado: { usuarioId: req.usuario.id } }
        ]
      },
      include: {
        itemPerdido: {
          include: { usuario: { select: { id: true, nome: true, avatar: true } } }
        },
        itemEncontrado: {
          include: { usuario: { select: { id: true, nome: true, avatar: true } } }
        }
      },
      orderBy: { score: 'desc' }
    });

    res.json({ sucesso: true, matches });
  } catch (erro) {
    console.error('Erro ao listar matches:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar correspondências' });
  }
};

/**
 * Confirmar que um match é correto ("Esse é meu item!")
 * POST /api/matching/:matchId/confirmar
 */
const confirmarMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        itemPerdido: true,
        itemEncontrado: { include: { usuario: true } }
      }
    });

    if (!match) {
      return res.status(404).json({ erro: true, mensagem: 'Match não encontrado' });
    }

    // Atualizar match como confirmado
    await prisma.match.update({
      where: { id: matchId },
      data: { confirmado: true }
    });

    // Atualizar status dos itens
    await prisma.item.updateMany({
      where: { id: { in: [match.itemPerdidoId, match.itemEncontradoId] } },
      data: { status: 'DEVOLVIDO' }
    });

    // Aumentar reputação de quem encontrou
    await prisma.usuario.update({
      where: { id: match.itemEncontrado.usuarioId },
      data: { reputacao: { increment: 10 } }
    });

    // Notificar quem encontrou
    const io = req.app.get('io');
    const { criarNotificacao } = require('../servicos/notificacao.servico');
    await criarNotificacao({
      usuarioId: match.itemEncontrado.usuarioId,
      titulo: '✅ Item reivindicado!',
      mensagem: `O dono do item "${match.itemPerdido.titulo}" confirmou que é o deles! +10 reputação.`,
      tipo: 'match',
      io
    });

    res.json({
      sucesso: true,
      mensagem: 'Match confirmado! Os itens foram marcados como devolvidos.'
    });
  } catch (erro) {
    console.error('Erro ao confirmar match:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao confirmar match' });
  }
};

module.exports = { obterMatches, listarMatchesUsuario, confirmarMatch };
