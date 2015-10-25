// Update with your config settings.
var config = require('./config')
module.exports = {

  development: {
    client: 'postgresql',
    connection: config.postgres,
    pool: {
      min: 1,
      max: 2
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: config.postgres,
    pool: {
      min: 1,
      max: 2
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
