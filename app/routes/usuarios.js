'use strict';

var router = require('express').Router();
var controller = require('../controllers/UsuarioController');
var validator = require('../validation/UsuarioValidator');

// rota para cadastro de usuário
router.post('/', validator.novo, controller.jaCadastrado, controller.novo);

// rota para busca de usuário
router.get('/:user_id', validator.busca, controller.busca);

// rota para autenticação de usuário
router.post('/autentica', validator.autentica, controller.autentica);

module.exports = router;
