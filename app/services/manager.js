var config = require('../../config')

var database = require('knex')({client: 'pg', connection: config.postgres})
var Manager = require('knex-schema')
var manager = new Manager(database)

var user = require('../models/user')

module.exports = {
  sync: function(){
    manager.sync([user])
  }
}
