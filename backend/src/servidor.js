// Servidor principal do "O Encontrei!"
// Inicializa Express, Socket.io, e todas as rotas

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Inicializar Prisma
const prisma = new PrismaClient();

// Criar app Express
const app = express();
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir uploads estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Disponibilizar prisma e io para as rotas
app.set('prisma', prisma);
app.set('io', io);

// Rota de saúde
app.get('/api/saude', (req, res) => {
  res.json({ status: 'ok', mensagem: 'O Encontrei! API está funcionando 🎉' });
});

// Importar rotas
const autenticacaoRotas = require('./rotas/autenticacao.rotas');
const itensRotas = require('./rotas/itens.rotas');
const matchingRotas = require('./rotas/matching.rotas');
const chatRotas = require('./rotas/chat.rotas');
const notificacoesRotas = require('./rotas/notificacoes.rotas');
const adminRotas = require('./rotas/admin.rotas');

// Registrar rotas
app.use('/api/autenticacao', autenticacaoRotas);
app.use('/api/itens', itensRotas);
app.use('/api/matching', matchingRotas);
app.use('/api/chat', chatRotas);
app.use('/api/notificacoes', notificacoesRotas);
app.use('/api/admin', adminRotas);

// Configurar Socket.io para chat em tempo real
const jwt = require('jsonwebtoken');

// Mapa de usuários conectados
const usuariosConectados = new Map();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Autenticação necessária'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.usuarioId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ Usuário conectado: ${socket.usuarioId}`);
  usuariosConectados.set(socket.usuarioId, socket.id);

  // Entrar na sala pessoal do usuário
  socket.join(socket.usuarioId);

  // Enviar mensagem
  socket.on('enviar_mensagem', async (dados) => {
    try {
      const { destinatarioId, conteudo } = dados;

      // Salvar no banco
      const mensagem = await prisma.mensagem.create({
        data: {
          conteudo,
          remetenteId: socket.usuarioId,
          destinatarioId
        },
        include: {
          remetente: { select: { id: true, nome: true, avatar: true } }
        }
      });

      // Enviar para o destinatário
      io.to(destinatarioId).emit('nova_mensagem', mensagem);

      // Criar notificação
      await prisma.notificacao.create({
        data: {
          titulo: 'Nova mensagem',
          mensagem: `${mensagem.remetente.nome} enviou uma mensagem`,
          tipo: 'mensagem',
          usuarioId: destinatarioId
        }
      });

      // Notificar em tempo real
      io.to(destinatarioId).emit('nova_notificacao', {
        tipo: 'mensagem',
        mensagem: `${mensagem.remetente.nome} enviou uma mensagem`
      });

      // Confirmar envio
      socket.emit('mensagem_enviada', mensagem);
    } catch (erro) {
      console.error('Erro ao enviar mensagem:', erro);
      socket.emit('erro', { mensagem: 'Erro ao enviar mensagem' });
    }
  });

  // Marcar mensagens como lidas
  socket.on('marcar_lidas', async (dados) => {
    try {
      const { remetenteId } = dados;
      await prisma.mensagem.updateMany({
        where: {
          remetenteId,
          destinatarioId: socket.usuarioId,
          lida: false
        },
        data: { lida: true }
      });
    } catch (erro) {
      console.error('Erro ao marcar mensagens como lidas:', erro);
    }
  });

  // Digitando...
  socket.on('digitando', (dados) => {
    io.to(dados.destinatarioId).emit('usuario_digitando', {
      usuarioId: socket.usuarioId
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Usuário desconectado: ${socket.usuarioId}`);
    usuariosConectados.delete(socket.usuarioId);
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    erro: true,
    mensagem: err.message || 'Erro interno do servidor'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 O Encontrei! Backend rodando na porta ${PORT}`);
  console.log(`📡 Socket.io pronto para conexões`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = { app, server, io };
