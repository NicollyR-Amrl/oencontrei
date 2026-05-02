// Feature: Notificações — Rotas

const express = require('express');
const router = express.Router();
const { listarNotificacoes, marcarComoLida, marcarTodasComoLidas } = require('./notificacoes.controlador');
const { verificarToken } = require('../../shared/autenticacao.middleware');

router.get('/', verificarToken, listarNotificacoes);
router.put('/todas-lidas', verificarToken, marcarTodasComoLidas);
router.put('/:id/lida', verificarToken, marcarComoLida);

module.exports = router;
