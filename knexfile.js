// Update with your config settings.

var config = require('./config')

module.exports = {
  development: {
    client: 'pg',
    connection: config.postgres, 
    migrations: {
      tableName: 'knex_migrations'
    }
  }

  production: {
    client: 'pg',
    connection: config.postgres, 
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
