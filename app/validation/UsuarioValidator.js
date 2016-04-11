'use strict';

var validator = {};

function checaErros(req, res, next) {
  var errors = req.validationErrors();
  if (errors) {
    var listaErros = [];
    for (var i = 0, tam = errors.length; i < tam; i++) {
      listaErros.push(errors[i].msg);
    }
    res.status(422).json({ message: listaErros });
  } else {
    next();
  }
}

validator.novo = function(req, res, next) {

  req.checkBody('nome', 'Informe o nome').notEmpty();
  req.checkBody('email', 'Informe um e-mail válido').isEmail();
  req.checkBody('senha', 'Informe uma senha').notEmpty();
  req.checkBody('telefones', 'Lista de telefones inválida').isListaTelefone();

  checaErros(req, res, next);
};

validator.autentica = function(req, res, next) {

  req.checkBody('email', 'Informe um e-mail válido').isEmail();
  req.checkBody('senha', 'Informe uma senha').notEmpty();

  checaErros(req, res, next);
};

validator.busca = function(req, res, next) {

  if (!req.headers.bearer) {
    res.status(401).json({ mensagem: 'Não autorizado' });
  } else {
    next();
  }
};

module.exports = validator;
