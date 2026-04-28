// Feature: Administração — Controlador
// CRUD de itens, aprovação, marcar como devolvido

const prisma = require('../../shared/prisma');
const { criarNotificacao } = require('../notificacoes/notificacoes.servico');

/**
 * Listar todos os itens (admin)
 * GET /api/admin/itens
 */
const listarTodosItens = async (req, res) => {
  try {
    const { status, tipo, pagina = 1, limite = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;

    const skip = (parseInt(pagina) - 1) * parseInt(limite);

    const [itens, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          usuario: { select: { id: true, nome: true, email: true, turma: true } }
        },
        orderBy: { criadoEm: 'desc' },
        skip,
        take: parseInt(limite)
      }),
      prisma.item.count({ where })
    ]);

    res.json({
      sucesso: true,
      itens,
      paginacao: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total,
        totalPaginas: Math.ceil(total / parseInt(limite))
      }
    });
  } catch (erro) {
    console.error('Erro ao listar itens (admin):', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar itens' });
  }
};

/**
 * Marcar item como devolvido (admin)
 * PUT /api/admin/itens/:id/devolvido
 */
const marcarDevolvido = async (req, res) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: { status: 'DEVOLVIDO' }
    });

    // Notificar o dono
    const io = req.app.get('io');
    await criarNotificacao({
      usuarioId: item.usuarioId,
      titulo: '📦 Item marcado como devolvido',
      mensagem: `O item "${item.titulo}" foi marcado como devolvido por um administrador.`,
      tipo: 'sistema',
      io
    });

    res.json({ sucesso: true, mensagem: 'Item marcado como devolvido!', item });
  } catch (erro) {
    console.error('Erro ao marcar como devolvido:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao marcar item' });
  }
};

/**
 * Deletar item (admin)
 * DELETE /api/admin/itens/:id
 */
const deletarItemAdmin = async (req, res) => {
  try {
    // Primeiro deletar matches relacionados
    await prisma.match.deleteMany({
      where: {
        OR: [
          { itemPerdidoId: req.params.id },
          { itemEncontradoId: req.params.id }
        ]
      }
    });

    await prisma.item.delete({ where: { id: req.params.id } });
    res.json({ sucesso: true, mensagem: 'Item removido com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar item (admin):', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao deletar item' });
  }
};

/**
 * Dashboard estatísticas
 * GET /api/admin/estatisticas
 */
const estatisticas = async (req, res) => {
  try {
    const [totalUsuarios, totalItens, itensPerdidos, itensEncontrados, itensDevolvidos, totalMatches] = await Promise.all([
      prisma.usuario.count(),
      prisma.item.count(),
      prisma.item.count({ where: { tipo: 'PERDIDO', status: 'ATIVO' } }),
      prisma.item.count({ where: { tipo: 'ENCONTRADO', status: 'ATIVO' } }),
      prisma.item.count({ where: { status: 'DEVOLVIDO' } }),
      prisma.match.count()
    ]);

    res.json({
      sucesso: true,
      estatisticas: {
        totalUsuarios,
        totalItens,
        itensPerdidos,
        itensEncontrados,
        itensDevolvidos,
        totalMatches
      }
    });
  } catch (erro) {
    console.error('Erro nas estatísticas:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao obter estatísticas' });
  }
};

module.exports = { listarTodosItens, marcarDevolvido, deletarItemAdmin, estatisticas };
