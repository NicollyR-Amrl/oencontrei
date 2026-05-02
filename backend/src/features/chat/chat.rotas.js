// Feature: Chat — Rotas

const express = require('express');
const router = express.Router();
const { listarConversas, obterMensagens } = require('./chat.controlador');
const { verificarToken } = require('../../shared/autenticacao.middleware');

router.get('/conversas', verificarToken, listarConversas);
router.get('/mensagens/:usuarioId', verificarToken, obterMensagens);

module.exports = router;
