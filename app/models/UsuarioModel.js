'use strict';

var sha1 = require('sha-1');
var md5 = require('md5');
var db = require('../../db/mongo');
var UsuarioModel = {};

UsuarioModel.novo = function(data, cb) {
  db.collection('usuarios').insert(data, cb);
};

UsuarioModel.emailJaCadastrado = function(email, cb) {
  var q = { email: email };
  db.collection('usuarios').count(q, cb);
};

UsuarioModel.autentica = function(data, cb) {
  var q = { email: data.email, senha: sha1(md5(data.senha)) };
  db.collection('usuarios').findOne(q, cb);
};

UsuarioModel.atualizaToken = function(_id, data, cb) {
  var q = { _id: _id };
  db.collection('usuarios').update(q, { $set: data }, cb);
};

UsuarioModel.buscaPorIdEToken = function(_id, token, cb) {
  var q = { _id: _id, token: token };
  db.collection('usuarios').findOne(q, cb);
};

module.exports = UsuarioModel;
