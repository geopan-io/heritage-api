'use strict';

// Development specific configuration
// ==================================

module.exports = {

  // Sequelize connecton opions
  sequelize: {
    uri: process.env.SEQUELIZE_URI,
    options: {
      logging: true,
      dialect: 'postgres',
      timezone: 'Australia/Sydney'
    }
  }

};
