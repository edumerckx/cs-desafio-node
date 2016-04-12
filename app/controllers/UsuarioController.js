'use strict';

var Promise = require('bluebird');
var moment = require('moment');
var uuid = require('uuid');
var config = require('config');
var jwt = require('jsonwebtoken');
var sha1 = require('sha-1');
var md5 = require('md5');
var messages = require('../../strings/messages.json');
var model = require('../models/UsuarioModel');
model = Promise.promisifyAll(model);

var controller = {};

controller.jaCadastrado = function(req, res, next) {

  model.emailJaCadastradoAsync(req.body.email)
    .then(function(data) {
      if (data) {
        res.status(422).json({ mensagem: messages.email_existente });
      } else {
        next();
      }
    });
};

// cadastro de usuário
controller.novo = function(req, res, next) {

  var usuario = req.body;
  var agora = moment().format('YYYY-MM-DD HH:mm:ss');
  usuario.data_criacao = agora;
  usuario.data_atualizacao = agora;
  usuario.ultimo_login = agora;
  usuario._id = uuid.v4();
  usuario.senha = sha1(md5(usuario.senha));
  usuario.token = jwt.sign({ email: usuario.email, ult_login: agora },
    config.get('jwt-secret'), { expiresIn: 1800 });

  model.novoAsync(req.body)
    .then(function(data){

      // id, data_criacao, data_atualizacao, ultimo_login, token
      var ret = {
        id: data._id,
        data_criacao: data.data_criacao,
        data_atualizacao: data.data_atualizacao,
        ultimo_login: data.ultimo_login,
        token: data.token
      };

      res.json(ret);
    })
    .catch(next);
};

// login de usuário de atualização de token
controller.autentica = function(req, res, next) {

  model.autenticaAsync(req.body)
    .then(function(dataAutentica) {

      if (dataAutentica) {
        var agora = moment().format('YYYY-MM-DD HH:mm:ss');
        var usuario = {};
        usuario.token = jwt.sign({ email: dataAutentica.email, ult_login: agora },
          config.get('jwt-secret'), { expiresIn: 1800 });
        usuario.ultimo_login = agora;
        usuario.data_atualizacao = agora;

        // com um usuário válido, atualiza o token
        // sempre que o login for realizado
        model.atualizaTokenAsync(dataAutentica._id, usuario)
          .then(function() {

            var ret = {
              id: dataAutentica._id,
              data_criacao: dataAutentica.data_criacao,
              data_atualizacao: usuario.data_atualizacao,
              ultimo_login: usuario.ultimo_login,
              token: usuario.token
            };

            res.json(ret);
          })
          .catch(next);
      } else {
        res.status(401).json({ mensagem: messages.login_invalido });
      }

    })
    .catch(next);
};

controller.busca = function(req, res, next) {

  model.buscaPorIdETokenAsync(req.params.user_id, req.headers.bearer)
    .then(function(data) {

      if (!data) {
        res.status(401).json({ mensagem: messages.nao_autorizado });
      } else {
        jwt.verify(data.token, config.get('jwt-secret'), function(err) {
          if (err) {
            res.status(403).json({ mensagem: messages.sessao_expirada });
          } else {
            res.json(data);
          }
        });
      }
    })
    .catch(next);
};


module.exports = controller;
