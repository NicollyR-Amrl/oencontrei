// Rotas de IA (Qwen OpenRouter)
const express = require('express');
const router = express.Router();
const {
  sugerirCategoria,
  chatAssistente,
  resumoAdmin,
  statusIA
} = require('../controladores/ia.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');

router.get('/status', statusIA);
router.post('/sugerir-categoria', verificarToken, sugerirCategoria);
router.post('/chat', verificarToken, chatAssistente);
router.get('/resumo-admin', verificarToken, resumoAdmin);

module.exports = router;
