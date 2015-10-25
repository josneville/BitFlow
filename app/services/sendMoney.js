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
				amount: String(Math.round(btcBalance * 100000000)),
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
						cb()
					})
					.catch(function(err){
						cb(err)
					})
			})
		})
}
