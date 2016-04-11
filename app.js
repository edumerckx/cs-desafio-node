'use strict';

var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();
var routes = require('./app/routes');
var optionsValidator = require('./utils/optionsValidator');

app.use(bodyParser.json());
app.use(expressValidator(optionsValidator));
app.use(helmet());

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Não encontrado');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 503);
  res.json({ mensagem: err.message });
  next();
});

module.exports = app;
