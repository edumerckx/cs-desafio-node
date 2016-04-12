'use strict';
var rewire = require('rewire');
var expect = require('expect.js');
var request = require('supertest-as-promised');
var messages = require('../strings/messages.json');
var app, validator, routes, controller;

describe('Teste validation usuários', function() {

  beforeEach(function() {
    app = rewire('../app');
    // validator = rewire('../app/validation/UsuarioValidator');
    // routes = rewire('../app/routes/usuarios');
    // routes.__set__('controller', {});
    // controller = rewire('../app/controllers/UsuarioController');
  });

  it('1. Validator para cadastro de usuarios - nenhum dado informado', function(done) {
    request(app)
      .post('/usuarios')
      .expect(422)
      .then(function(res) {

        var dados = res.body;
        expect(dados).to.be.a('object');
        expect(dados).to.have.property('mensagem');
        expect(dados.mensagem).to.be.a('array');
        expect(dados.mensagem.length).to.be.equal(4);

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it.skip('2. Validator para cadastro de usuarios - dados ok', function(done) {
    var usuario = {
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: 'teste',
      telefones: [{ telefone: '12345678', ddd: '11' }]
    };

    //var controller = {};
    controller.jaCadastrado = function(req, res, next) {
      console.log('adfas')
      expect(req.body).to.be.a('object');
      expect(req.body).to.have.keys(['nome', 'email', 'senha', 'telefones']);
      done();
    };

    // routes.__set__('controller', controller);

    request(app)
      .post('/usuarios')
      .send(usuario)
      .expect(200)
      .then(function(res) {
        console.log(res);
        done();
      })
      .catch(function(err) {
        done(err);
      })

  });

  it('2. Validator para autenticação (login) de usuários - nenhum dado informado', function(done) {
    request(app)
      .post('/usuarios/autentica')
      .expect(422)
      .then(function(res) {

        var dados = res.body;
        expect(dados).to.be.a('object');
        expect(dados).to.have.property('mensagem');
        expect(dados.mensagem).to.be.a('array');
        expect(dados.mensagem.length).to.be.equal(2);

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });

  it('3. Validator para busca de usuarios', function(done) {
    request(app)
      .get('/usuarios/123')
      .expect(401)
      .then(function(res) {

        var dados = res.body;
        expect(dados).to.be.a('object');
        expect(dados).to.have.property('mensagem');
        expect(dados.mensagem).to.be.eql(messages.nao_autorizado);

        done();
      })
      .catch(function(err) {
        done(err);
      });
  });


});
