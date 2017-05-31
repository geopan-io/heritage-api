'use strict';

// Development specific configuration
// ==================================

module.exports = {

  // Sequelize connecton opions
  sequelize: {
    uri: 'postgres://geopan:30cattanoav@geopan.io/heritage',
    options: {
      logging: true,
      dialect: 'postgres',
      timezone: 'Australia/Sydney'
    }
  }

};
