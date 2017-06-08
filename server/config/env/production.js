'use strict';

// Development specific configuration
// ==================================

module.exports = {

  // Sequelize connecton opions
  sequelize: {
      logging: true,
      dialect: 'postgres',
      timezone: 'Australia/Sydney',
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PWD || 'password',
      database: process.env.PG_DB || 'heritage',
      host: process.env.PG_HOST || 'localhost',
      port:process.env.PG_PORT || 5432
  }

};
