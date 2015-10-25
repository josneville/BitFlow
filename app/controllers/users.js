var config = require('../../config')

var knex = require('knex')({client: 'postgresql', connection: config.postgres})
var blockchain = require('blockchain.info')

module.exports = {
  balance: function(req, res, next){

  }
}
