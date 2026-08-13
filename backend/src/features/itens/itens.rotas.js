// Feature: Itens — Rotas

const express = require('express');
const router = express.Router();
const { criarItem, listarItens, obterItem, atualizarItem, deletarItem, meusItens } = require('./itens.controlador');
const { verificarToken } = require('../../shared/autenticacao.middleware');
const { validarItem } = require('../../shared/validacao.middleware');
const { upload, tratarUploadSingle } = require('../../shared/upload.middleware');

// Rotas públicas (listagem)
router.get('/', listarItens);
router.get('/usuario/meus', verificarToken, meusItens); // antes de /:id para não conflitar
router.get('/:id', obterItem);

// Rotas protegidas
router.post('/', verificarToken, tratarUploadSingle('imagem'), validarItem, criarItem);
router.put('/:id', verificarToken, tratarUploadSingle('imagem'), atualizarItem);
router.delete('/:id', verificarToken, deletarItem);

module.exports = router;
