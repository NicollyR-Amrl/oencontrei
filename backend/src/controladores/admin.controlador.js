// Controlador de Administração
// CRUD de itens, aprovação, marcar como devolvido

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    const { criarNotificacao } = require('../servicos/notificacao.servico');
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

/**
 * Listar todos os usuários (admin)
 * GET /api/admin/usuarios
 */
const listarUsuarios = async (req, res) => {
  try {
    const { busca = '', pagina = 1, limite = 20 } = req.query;
    const skip = (parseInt(pagina) - 1) * parseInt(limite);

    const where = busca
      ? {
          OR: [
            { nome: { contains: busca, mode: 'insensitive' } },
            { email: { contains: busca, mode: 'insensitive' } },
          ],
        }
      : {};

    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        select: {
          id: true,
          nome: true,
          email: true,
          turma: true,
          cargo: true,
          reputacao: true,
          avatar: true,
          criadoEm: true,
          _count: { select: { itens: true } },
        },
        orderBy: { criadoEm: 'desc' },
        skip,
        take: parseInt(limite),
      }),
      prisma.usuario.count({ where }),
    ]);

    res.json({
      sucesso: true,
      usuarios,
      paginacao: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total,
        totalPaginas: Math.ceil(total / parseInt(limite)),
      },
    });
  } catch (erro) {
    console.error('Erro ao listar usuários (admin):', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar usuários' });
  }
};

/**
 * Alterar cargo do usuário (admin)
 * PUT /api/admin/usuarios/:id/cargo
 */
const alterarCargo = async (req, res) => {
  try {
    const { cargo } = req.body;
    const cargosValidos = ['ALUNO', 'PROFESSOR', 'FUNCIONARIO', 'ADMIN'];
    if (!cargosValidos.includes(cargo)) {
      return res.status(400).json({ erro: true, mensagem: 'Cargo inválido' });
    }
    // Não pode alterar o próprio cargo
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({ erro: true, mensagem: 'Você não pode alterar seu próprio cargo' });
    }
    const usuario = await prisma.usuario.update({
      where: { id: req.params.id },
      data: { cargo },
      select: { id: true, nome: true, email: true, cargo: true },
    });
    res.json({ sucesso: true, mensagem: 'Cargo atualizado com sucesso!', usuario });
  } catch (erro) {
    console.error('Erro ao alterar cargo:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao alterar cargo' });
  }
};

/**
 * Deletar usuário (admin)
 * DELETE /api/admin/usuarios/:id
 */
const deletarUsuario = async (req, res) => {
  try {
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({ erro: true, mensagem: 'Você não pode deletar sua própria conta' });
    }
    // Deletar dependências na ordem correta
    const itens = await prisma.item.findMany({ where: { usuarioId: req.params.id }, select: { id: true } });
    const itemIds = itens.map(i => i.id);
    if (itemIds.length > 0) {
      await prisma.match.deleteMany({ where: { OR: [{ itemPerdidoId: { in: itemIds } }, { itemEncontradoId: { in: itemIds } }] } });
    }
    await prisma.item.deleteMany({ where: { usuarioId: req.params.id } });
    await prisma.mensagem.deleteMany({ where: { OR: [{ remetenteId: req.params.id }, { destinatarioId: req.params.id }] } });
    await prisma.notificacao.deleteMany({ where: { usuarioId: req.params.id } });
    await prisma.usuario.delete({ where: { id: req.params.id } });
    res.json({ sucesso: true, mensagem: 'Usuário removido com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar usuário (admin):', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao deletar usuário' });
  }
};

module.exports = { listarTodosItens, marcarDevolvido, deletarItemAdmin, estatisticas, listarUsuarios, alterarCargo, deletarUsuario };
