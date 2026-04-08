// Controlador de Chat
// Histórico de conversas e mensagens

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Listar conversas do usuário (lista de contatos com última mensagem)
 * GET /api/chat/conversas
 */
const listarConversas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Buscar todas as mensagens do usuário
    const mensagens = await prisma.mensagem.findMany({
      where: {
        OR: [
          { remetenteId: usuarioId },
          { destinatarioId: usuarioId }
        ]
      },
      include: {
        remetente: { select: { id: true, nome: true, avatar: true } },
        destinatario: { select: { id: true, nome: true, avatar: true } }
      },
      orderBy: { criadoEm: 'desc' }
    });

    // Agrupar por contato (ID do outro usuário)
    const conversasMap = new Map();
    mensagens.forEach(msg => {
      const outroUsuario = msg.remetenteId === usuarioId ? msg.destinatario : msg.remetente;
      if (!conversasMap.has(outroUsuario.id)) {
        conversasMap.set(outroUsuario.id, {
          usuario: outroUsuario,
          ultimaMensagem: msg,
          naoLidas: 0
        });
      }
      if (msg.destinatarioId === usuarioId && !msg.lida) {
        const conversa = conversasMap.get(outroUsuario.id);
        conversa.naoLidas++;
      }
    });

    const conversas = Array.from(conversasMap.values());
    res.json({ sucesso: true, conversas });
  } catch (erro) {
    console.error('Erro ao listar conversas:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao listar conversas' });
  }
};

/**
 * Obter mensagens de uma conversa específica
 * GET /api/chat/mensagens/:usuarioId
 */
const obterMensagens = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const meuId = req.usuario.id;

    const mensagens = await prisma.mensagem.findMany({
      where: {
        OR: [
          { remetenteId: meuId, destinatarioId: usuarioId },
          { remetenteId: usuarioId, destinatarioId: meuId }
        ]
      },
      include: {
        remetente: { select: { id: true, nome: true, avatar: true } }
      },
      orderBy: { criadoEm: 'asc' }
    });

    // Marcar como lidas
    await prisma.mensagem.updateMany({
      where: {
        remetenteId: usuarioId,
        destinatarioId: meuId,
        lida: false
      },
      data: { lida: true }
    });

    res.json({ sucesso: true, mensagens });
  } catch (erro) {
    console.error('Erro ao obter mensagens:', erro);
    res.status(500).json({ erro: true, mensagem: 'Erro ao obter mensagens' });
  }
};

module.exports = { listarConversas, obterMensagens };
