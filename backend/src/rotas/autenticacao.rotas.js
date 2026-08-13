// Rotas de Autenticação

const express = require('express');
const router = express.Router();
const { registrar, login, perfil, atualizarPerfil, aceitarTermos } = require('../controladores/autenticacao.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');
const { validarCadastro, validarLogin } = require('../middlewares/validacao.middleware');
const { upload, tratarUploadSingle } = require('../middlewares/upload.middleware');

// Rotas públicas
router.post('/registrar', validarCadastro, registrar);
router.post('/login', validarLogin, login);

// Rotas protegidas
router.get('/perfil', verificarToken, perfil);
router.put('/perfil', verificarToken, tratarUploadSingle('avatar'), atualizarPerfil);
router.post('/termos', verificarToken, aceitarTermos);

module.exports = router;
