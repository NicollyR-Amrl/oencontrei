// Rotas de Itens

const express = require('express');
const router = express.Router();
const { criarItem, listarItens, obterItem, atualizarItem, deletarItem, meusItens } = require('../controladores/itens.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');
const { validarItem } = require('../middlewares/validacao.middleware');
const { upload, tratarUploadSingle } = require('../middlewares/upload.middleware');

// Rotas públicas (listagem)
router.get('/', listarItens);
router.get('/usuario/meus', verificarToken, meusItens); // deve vir ANTES de /:id

// Rotas protegidas
router.post('/', verificarToken, tratarUploadSingle('imagem'), validarItem, criarItem);
router.put('/:id', verificarToken, tratarUploadSingle('imagem'), atualizarItem);
router.delete('/:id', verificarToken, deletarItem);
router.get('/:id', obterItem);

module.exports = router;
