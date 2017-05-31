/**
 * Sequelize initialization module
 */

'use strict';

const config = require('../config/env');
const Sequelize = require('sequelize');

var db = {
  Sequelize: Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Heritage = db.sequelize.import('../api/heritage/heritage.model');

module.exports = db;
