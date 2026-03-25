// Rotas de Autenticação

const express = require('express');
const router = express.Router();
const { registrar, login, perfil, atualizarPerfil } = require('../controladores/autenticacao.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');
const { validarCadastro, validarLogin } = require('../middlewares/validacao.middleware');
const { upload } = require('../middlewares/upload.middleware');

// Rotas públicas
router.post('/registrar', validarCadastro, registrar);
router.post('/login', validarLogin, login);

// Rotas protegidas
router.get('/perfil', verificarToken, perfil);
router.put('/perfil', verificarToken, upload.single('avatar'), atualizarPerfil);

module.exports = router;
