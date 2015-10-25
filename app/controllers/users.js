var config = require('../../config')
var request = require('superagent')
var blockchain = require('blockchain.info')

var knex = require('knex')({
	client: 'postgresql',
	connection: config.postgres
})
var stripe = require('stripe')(config.stripe)

var getBalance = require('../services/balance')

module.exports = {
	balance: function (req, res, next) {
		var user = res.locals.user
		var password = req.query.password

		getBalance(user, password, function (err, balance) {
			if (err) return next(err)
			return res.status(200).send({
				balance: balance
			})
		})
	},
	account: function (req, res, next) {
		var user = res.locals.user
		var card = req.body.card
		var password = req.body.password
		
		stripe.customers.create({
				email: user.email
			})
			.then(function (customer) {
				return stripe.customers.createSource(customer.id, {
					source: card
				})
			})
			.then(function (card) {
				var newWallet = new blockchain.CreateWallet(password, config.blockchain)
				newWallet.create(function (err, wallet) {
					knex('users')
						.where({
							id: user.id
						})
						.update({
							blockchain_wallet: wallet.guid,
							bitcoin_address: wallet.address,
							stripe_customer_id: card.customer,
							stripe_card_id: card.id
						})
						.then(function (num) {
							res.status(200).send({})
						})
				})
			})
			.catch(function (err) {
				next(err)
			})
	}
}
