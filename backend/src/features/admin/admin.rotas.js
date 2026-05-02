// Feature: Administração — Rotas

const express = require('express');
const router = express.Router();
const { listarTodosItens, marcarDevolvido, deletarItemAdmin, estatisticas } = require('./admin.controlador');
const { verificarToken, verificarAdmin } = require('../../shared/autenticacao.middleware');

// Todas as rotas de admin requerem autenticação + cargo ADMIN
router.use(verificarToken, verificarAdmin);

router.get('/estatisticas', estatisticas);
router.get('/itens', listarTodosItens);
router.put('/itens/:id/devolvido', marcarDevolvido);
router.delete('/itens/:id', deletarItemAdmin);

module.exports = router;
