'use strict';

var validator = {};
var messages = require('../../strings/messages.json');

function checaErros(req, res, next) {
  var errors = req.validationErrors();
  if (errors) {
    var listaErros = [];
    for (var i = 0, tam = errors.length; i < tam; i++) {
      listaErros.push(errors[i].msg);
    }
    res.status(422).json({ mensagem: listaErros });
  } else {
    next();
  }
}

validator.novo = function(req, res, next) {

  req.checkBody('nome', messages.nome_invalido).notEmpty();
  req.checkBody('email', messages.email_invalido).isEmail();
  req.checkBody('senha', messages.senha_invalida).notEmpty();
  req.checkBody('telefones', messages.telefones_invalido).isListaTelefone();

  checaErros(req, res, next);
};

validator.autentica = function(req, res, next) {

  req.checkBody('email', messages.email_invalido).isEmail();
  req.checkBody('senha', messages.senha_invalida).notEmpty();

  checaErros(req, res, next);
};

validator.busca = function(req, res, next) {

  if (!req.headers.bearer) {
    res.status(401).json({ mensagem: messages.nao_autorizado });
  } else {
    next();
  }
};

module.exports = validator;
