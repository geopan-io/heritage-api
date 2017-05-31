/*!
 * Heritage API.
 *
 * Main application entry.
 * @author Guillaume de Boyer <guillaume@geopan.io>
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const sqldb = require('./sqldb');
const config = require('./config/env');
const http = require('http');

// Setup server
const app = express();
const server = http.createServer(app);

require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Heritage API listening on %d, in %s mode', config.port, app.get('env'));
  });
}

sqldb.sequelize.sync()
  .then(startServer)
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });

// Expose app
exports = module.exports = app;
