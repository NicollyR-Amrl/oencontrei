// Rotas de Notificações

const express = require('express');
const router = express.Router();
const { listarNotificacoes, marcarComoLida, marcarTodasComoLidas } = require('../controladores/notificacoes.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');

router.get('/', verificarToken, listarNotificacoes);
router.put('/todas-lidas', verificarToken, marcarTodasComoLidas);
router.put('/:id/lida', verificarToken, marcarComoLida);

module.exports = router;
