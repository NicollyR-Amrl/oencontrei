// Feature: Autenticação — Rotas

const express = require('express');
const router = express.Router();
const { registrar, login, perfil, atualizarPerfil, obterUsuario } = require('./autenticacao.controlador');
const { verificarToken } = require('../../shared/autenticacao.middleware');
const { validarCadastro, validarLogin } = require('../../shared/validacao.middleware');
const { upload } = require('../../shared/upload.middleware');

// Rotas públicas
router.post('/registrar', upload.single('avatar'), validarCadastro, registrar);
router.post('/login', validarLogin, login);
router.get('/usuario/:id', obterUsuario);

// Rotas protegidas
router.get('/perfil', verificarToken, perfil);
router.put('/perfil', verificarToken, upload.single('avatar'), atualizarPerfil);

module.exports = router;
