var config = require('../../config')
var knex = require('knex')({client: 'postgresql', connection: config.postgres})

var blockchain = require('blockchain.info')
var request = require('superagent')

module.exports = function (from, password, to, amount, message, cb) {
	
	request
		.get('https://blockchain.info/ticker')
		.end(function (err, response) {
			if (err) return cb(err, null)
			var btcBalance = amount / response.body.USD.last
			var myWallet = new blockchain.MyWallet(from.blockchain_wallet, password)
			myWallet.send({
				to: to.bitcoin_address,
				amount: String(Math.round((btcBalance) * 100000000) - 10000),
				BTC: true
			}, function (err, response) {
				if (err) return cb(err, null)
				knex('transactions')
					.insert({
						from_id: from.id,
						to_id: to.id,
						amount: amount,
						message: message
					})
					.then(function(){
						cb(null, response)
					})
					.catch(function(err){
						cb(err, null)
					})
			})
		})

	// function check() {
	// 	var user = res.locals.user
	// 	var auth = 'Basic ' + new Buffer(config.FEEDZAI_KEY + ':').toString('base64');

	// 	request
	// 		.post('https://api.feedzai.com/v1/payments')
	// 			.send({ 
	// 				user_id: user.id,
	// 				name: user.name,
	// 				amount: 10 
	// 			})
	// 			.set('Authorization', auth)
	// 			.set('Content-Type', 'application/json')
	// 		.end(function(err, response){

	// 		})
	// }
}
