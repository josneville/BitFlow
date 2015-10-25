var config = require('../../config')
var request = require('superagent')
var blockchain = require('blockchain.info')

var knex = require('knex')({client: 'postgresql', connection: config.postgres})

module.exports = {
  balance: function(req, res, next){

  	var user = res.locals.user
  	var pass = req.body.password

  	request
		.get('https://blockchain.info/merchant/' + user.blockchain_wallet + '/balance?password=' + pass)
		.end(function(err, response){
			if (err) {
				next(err)
			}

			res.status(200).send({balance: response.balance})
		})
  }
}
