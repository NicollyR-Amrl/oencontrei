// Rotas de Chat

const express = require('express');
const router = express.Router();
const { listarConversas, obterMensagens } = require('../controladores/chat.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');

router.get('/conversas', verificarToken, listarConversas);
router.get('/mensagens/:usuarioId', verificarToken, obterMensagens);

module.exports = router;
