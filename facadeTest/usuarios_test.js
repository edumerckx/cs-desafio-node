'use strict';
var request = require('supertest-as-promised');
var expect = require('expect.js');
var sha1 = require('sha-1');
var md5 = require('md5');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var config = require('config');
var uuid = require('uuid');
var app = require('../app');
var db = require('../db/mongo');
var usuario, agora;

describe('Teste dos endpoints em /usuarios', function() {

  this.timeout(15000);

  beforeEach(function() {
    usuario = {
      nome: 'Eduardo',
      email: 'test@test.com',
      senha: 'abcabc',
      telefones: [{ telefone: '12345678', ddd: '11' }]
    };
    agora = moment().format('YYYY-MM-DD HH:mm:ss');
  })

  afterEach(function(done) {
    usuario = null;
    db.collection('usuarios').remove({}, done);
  });

  it('POST /usuarios - Cadastro de usuários', function(done) {

    request(app)
      .post('/usuarios')
      .send(usuario)
      .expect(200)
      .then(function(res) {

        var dados = res.body;
        expect(dados).to.be.a('object');
        expect(dados).to.have.keys(['id', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);

        done();
      })
      .catch(function(err) {
        done(err);
      });

  });

  it('POST /usuarios/autentica - Login de usuários', function(done) {

    var senha = usuario.senha;
    usuario.senha = sha1(md5(senha));
    usuario.data_criacao = agora;
    db.collection('usuarios').insert(usuario, function(err, data) {
      if (err) {
        done(err);
      } else {
        request(app)
          .post('/usuarios/autentica')
          .send({ email: usuario.email, senha: senha })
          .expect(200)
          .then(function(res) {

            var dados = res.body;
            expect(dados).to.be.a('object');
            expect(dados).to.have.keys(['id', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);

            done();
          })
          .catch(function(err) {
            done(err);
          })
      }
    });

  });

  it('GET /usuarios/:user_id - Busca usuário', function(done) {

    var senha = usuario.senha;
    usuario._id = uuid.v4();
    usuario.senha = sha1(md5(senha));
    usuario.ultimo_login = agora;
    usuario.data_criacao = agora;
    usuario.data_atualizacao = agora;
    usuario.token = jwt.sign({ email: usuario.email, ult_login: agora },
      config.get('jwt-secret'), { expiresIn: 1800 });
    db.collection('usuarios').insert(usuario, function(err, data) {
      if (err) {
        done(err);
      } else {

        request(app)
          .get('/usuarios/' + data._id)
          .set('Bearer', data.token)
          .expect(200)
          .then(function(res) {

            var dados = res.body;
            expect(dados).to.be.a('object');
            expect(dados).to.have.keys(['_id', 'data_criacao', 'data_atualizacao',
              'ultimo_login', 'nome', 'senha', 'email', 'token']);

            done();
          })
          .catch(function(err) {
            done(err);
          });
      }
    });

  });

});
