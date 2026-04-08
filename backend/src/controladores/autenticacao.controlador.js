// Controlador de Autenticação
// Registro, login e perfil de usuários

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Registrar novo usuário
 * POST /api/autenticacao/registrar
 */
const registrar = async (req, res) => {
  try {
    const { nome, email, senha, turma, cargo } = req.body;

    // Verificar se email já existe
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(400).json({
        erro: true,
        mensagem: 'Este email já está cadastrado'
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 12);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        turma: turma || null,
        cargo: cargo || 'ALUNO'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        turma: true,
        cargo: true,
        reputacao: true,
        criadoEm: true
      }
    });

    // Gerar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario,
      token
    });
  } catch (erro) {
    console.error('Erro no registro:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao cadastrar usuário' });
  }
};

/**
 * Login do usuário
 * POST /api/autenticacao/login
 */
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({
        erro: true,
        mensagem: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({
        erro: true,
        mensagem: 'Email ou senha incorretos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        turma: usuario.turma,
        cargo: usuario.cargo,
        reputacao: usuario.reputacao,
        avatar: usuario.avatar
      },
      token
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao fazer login' });
  }
};

/**
 * Obter perfil do usuário autenticado
 * GET /api/autenticacao/perfil
 */
const perfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nome: true,
        email: true,
        turma: true,
        cargo: true,
        reputacao: true,
        avatar: true,
        criadoEm: true,
        itens: {
          select: { id: true, titulo: true, tipo: true, status: true, criadoEm: true },
          orderBy: { criadoEm: 'desc' }
        }
      }
    });

    res.json({ sucesso: true, usuario });
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao buscar perfil' });
  }
};

/**
 * Atualizar perfil do usuário
 * PUT /api/autenticacao/perfil
 */
const atualizarPerfil = async (req, res) => {
  try {
    const { nome, turma } = req.body;
    const dados = {};
    if (nome) dados.nome = nome;
    if (turma !== undefined) dados.turma = turma;

    // Se houver upload de avatar
    if (req.file) {
      dados.avatar = `/uploads/${req.file.filename}`;
    }

    const usuario = await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: dados,
      select: {
        id: true,
        nome: true,
        email: true,
        turma: true,
        cargo: true,
        reputacao: true,
        avatar: true
      }
    });

    res.json({ sucesso: true, mensagem: 'Perfil atualizado!', usuario });
  } catch (erro) {
    console.error('Erro ao atualizar perfil:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao atualizar perfil' });
  }
};

module.exports = { registrar, login, perfil, atualizarPerfil };
