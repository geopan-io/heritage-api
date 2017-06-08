'use strict';

// Development specific configuration
// ==================================

module.exports = {

  // Sequelize connecton opions
  sequelize: {
      logging: true,
      dialect: 'postgres',
      timezone: 'Australia/Sydney',
      username: process.env.PG_USER,
      password: process.env.PG_PWD,
      database: process.env.PG_DB,
      host: process.env.PG_HOST,
      port:process.env.PG_PORT || 5432
  }

};
