/**
 * Express configuration
 */

'use strict';

const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');
const helmet = require('helmet'); // Helmet helps you secure your Express apps by setting various HTTP headers
const path = require('path');
const config = require('./env');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');


module.exports = function(app) {
  const env = app.get('env');

  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(helmet());

  app.set('appPath', path.join(config.root, 'public'));

  if ('production' === env) {
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }

  if ('development' === env) {
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://geopan.au.auth0.com/.well-known/jwks.json"
    }),
    audience: 'heritage.geopan.io',
    issuer: "https://geopan.auth0.com/",
    algorithms: ['RS256']
  });

  app.use(jwtCheck);

  // return error message for unauthorized requests
  app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ message: 'Missing or invalid token' });
    } else {
      return next;
    }
  });

};
