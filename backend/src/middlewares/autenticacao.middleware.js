// Middleware de autenticação JWT
// Verifica e decodifica o token em todas as rotas protegidas

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware que verifica o token JWT no header Authorization
 */
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        erro: true,
        mensagem: 'Token de acesso não fornecido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário no banco
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        turma: true,
        reputacao: true,
        avatar: true
      }
    });

    if (!usuario) {
      return res.status(401).json({
        erro: true,
        mensagem: 'Usuário não encontrado'
      });
    }

    req.usuario = usuario;
    next();
  } catch (erro) {
    if (erro.name === 'JsonWebTokenError') {
      return res.status(401).json({
        erro: true,
        mensagem: 'Token inválido'
      });
    }
    if (erro.name === 'TokenExpiredError') {
      return res.status(401).json({
        erro: true,
        mensagem: 'Token expirado'
      });
    }
    return res.status(500).json({
      erro: true,
      mensagem: 'Erro na autenticação'
    });
  }
};

/**
 * Middleware que verifica se o usuário é admin
 */
const verificarAdmin = (req, res, next) => {
  if (req.usuario.cargo !== 'ADMIN') {
    return res.status(403).json({
      erro: true,
      mensagem: 'Acesso negado. Permissão de administrador necessária.'
    });
  }
  next();
};

module.exports = { verificarToken, verificarAdmin };
