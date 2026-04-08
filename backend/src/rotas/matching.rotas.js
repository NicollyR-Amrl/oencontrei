// Rotas de Matching

const express = require('express');
const router = express.Router();
const { obterMatches, listarMatchesUsuario, confirmarMatch } = require('../controladores/matching.controlador');
const { verificarToken } = require('../middlewares/autenticacao.middleware');

router.get('/', verificarToken, listarMatchesUsuario);
router.get('/:itemId', verificarToken, obterMatches);
router.post('/:matchId/confirmar', verificarToken, confirmarMatch);

module.exports = router;
