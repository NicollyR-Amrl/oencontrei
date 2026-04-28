// Feature: Itens — Controlador
// CRUD completo para itens perdidos e encontrados

const prisma = require('../../shared/prisma');

/**
 * Criar novo item (perdido ou encontrado)
 * POST /api/itens
 */
const criarItem = async (req, res) => {
  try {
    const { titulo, descricao, categoria, tipo, local, data } = req.body;

    const item = await prisma.item.create({
      data: {
        titulo, descricao, categoria, tipo, local,
        data: data ? new Date(data) : new Date(),
        imagem: req.file ? `/uploads/${req.file.filename}` : null,
        usuarioId: req.usuario.id
      },
      include: {
        usuario: { select: { id: true, nome: true, avatar: true } }
      }
    });

    res.status(201).json({
      sucesso: true,
      mensagem: `Item ${tipo === 'PERDIDO' ? 'perdido' : 'encontrado'} cadastrado com sucesso!`,
      item
    });
  } catch (erro) {
    console.error('Erro ao criar item:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao cadastrar item' });
  }
};

/**
 * Listar itens com filtros e paginação
 * GET /api/itens
 */
const listarItens = async (req, res) => {
  try {
    const {
      tipo, categoria, local, busca,
      pagina = 1, limite = 12, status = 'ATIVO'
    } = req.query;

    const where = {};
    if (tipo) where.tipo = tipo;
    if (categoria) where.categoria = categoria;
    if (status) where.status = status;
    if (local) where.local = { contains: local, mode: 'insensitive' };
    if (busca) {
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } }
      ];
    }

    const skip = (parseInt(pagina) - 1) * parseInt(limite);

    const [itens, total] = await Promise.all([
      prisma.item.findMany({
        where,
        include: { usuario: { select: { id: true, nome: true, avatar: true } } },
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
    console.error('Erro ao listar itens:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar itens' });
  }
};

/**
 * Obter item por ID
 * GET /api/itens/:id
 */
const obterItem = async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id },
      include: { usuario: { select: { id: true, nome: true, avatar: true, turma: true } } }
    });

    if (!item) {
      return res.status(404).json({ erro: true, mensagem: 'Item não encontrado' });
    }

    res.json({ sucesso: true, item });
  } catch (erro) {
    console.error('Erro ao obter item:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao obter item' });
  }
};

/**
 * Atualizar item
 * PUT /api/itens/:id
 */
const atualizarItem = async (req, res) => {
  try {
    const item = await prisma.item.findUnique({ where: { id: req.params.id } });

    if (!item) {
      return res.status(404).json({ erro: true, mensagem: 'Item não encontrado' });
    }

    if (item.usuarioId !== req.usuario.id && req.usuario.cargo !== 'ADMIN') {
      return res.status(403).json({ erro: true, mensagem: 'Sem permissão para editar este item' });
    }

    const dados = {};
    const campos = ['titulo', 'descricao', 'categoria', 'tipo', 'local', 'status'];
    campos.forEach(campo => {
      if (req.body[campo] !== undefined) dados[campo] = req.body[campo];
    });
    if (req.file) dados.imagem = `/uploads/${req.file.filename}`;

    const itemAtualizado = await prisma.item.update({
      where: { id: req.params.id },
      data: dados,
      include: { usuario: { select: { id: true, nome: true, avatar: true } } }
    });

    res.json({ sucesso: true, mensagem: 'Item atualizado com sucesso!', item: itemAtualizado });
  } catch (erro) {
    console.error('Erro ao atualizar item:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao atualizar item' });
  }
};

/**
 * Deletar item
 * DELETE /api/itens/:id
 */
const deletarItem = async (req, res) => {
  try {
    const item = await prisma.item.findUnique({ where: { id: req.params.id } });

    if (!item) {
      return res.status(404).json({ erro: true, mensagem: 'Item não encontrado' });
    }

    if (item.usuarioId !== req.usuario.id && req.usuario.cargo !== 'ADMIN') {
      return res.status(403).json({ erro: true, mensagem: 'Sem permissão para deletar este item' });
    }

    await prisma.item.delete({ where: { id: req.params.id } });
    res.json({ sucesso: true, mensagem: 'Item removido com sucesso!' });
  } catch (erro) {
    console.error('Erro ao deletar item:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao deletar item' });
  }
};

/**
 * Listar itens do usuário autenticado
 * GET /api/itens/usuario/meus
 */
const meusItens = async (req, res) => {
  try {
    const itens = await prisma.item.findMany({
      where: { usuarioId: req.usuario.id },
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true, avatar: true } } }
    });

    res.json({ sucesso: true, itens });
  } catch (erro) {
    console.error('Erro ao listar meus itens:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar seus itens' });
  }
};

module.exports = { criarItem, listarItens, obterItem, atualizarItem, deletarItem, meusItens };
