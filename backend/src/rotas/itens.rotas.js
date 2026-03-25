// Rotas de Itens

const express = require('express');
const router = express.Router();
const { criarItem, listarItens, obterItem, atualizarItem, deletarItem, meusItens } = require('../controladores/itens.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');
const { validarItem } = require('../middlewares/validacao.middleware');
const { upload } = require('../middlewares/upload.middleware');

// Rotas públicas (listagem)
router.get('/', listarItens);
router.get('/:id', obterItem);

// Rotas protegidas
router.post('/', verificarToken, upload.single('imagem'), validarItem, criarItem);
router.put('/:id', verificarToken, upload.single('imagem'), atualizarItem);
router.delete('/:id', verificarToken, deletarItem);
router.get('/usuario/meus', verificarToken, meusItens);

module.exports = router;
