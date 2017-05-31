/**
 * Main application routes
 */

'use strict';

const errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/heritages', require('./api/heritage'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth)/*')
    .get(errors[404]);

};
