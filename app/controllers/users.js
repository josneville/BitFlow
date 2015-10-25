var config = require('../../config')
var request = require('superagent')
var blockchain = require('blockchain.info')
var deepcopy = require('deepcopy')
var knex = require('knex')({
	client: 'postgresql',
	connection: config.postgres
})
var stripe = require('stripe')(config.stripe)

var getBalance = require('../services/balance')
var sendMoney = require('../services/sendMoney')

module.exports = {
	balance: function (req, res, next) {
		var user = res.locals.user
		var password = config.password // req.query.password

		getBalance(user, password, function (err, balance) {
			if (err) return next(err)
			return res.status(200).send({
				balance: balance
			})
		})
	},
	withdraw: function (req, res, next) {
		var user = res.locals.user
		var password = config.password //req.body.password
		getBalance(user, password, function (err, balance) {
			if (err) return next(err)
			stripe.bitcoinReceivers.create({
				amount: (balance * 100) - 3,
				currency: "usd",
				email: user.email
			}, function (err, receiver) {
				if (err) return next(err)
				toUser = deepcopy(user)
				toUser.bitcoin_address = receiver.inbound_address
				sendMoney(user, password, toUser, balance, "Withdraw", function (err, response) {
					if (err || response.error) return next(err)
					return res.status(200).send({})
				})
			})
		})
	},
	account: function (req, res, next) {
		var user = res.locals.user
		var card = req.body.card
		var password = config.password //req.body.password

		stripe.customers.create({
				email: user.email
			})
			.then(function (customer) {
				return stripe.customers.createSource(customer.id, {
					source: card
				})
			})
			.then(function (card) {
				if (user.blockchain_wallet){
					knex('users')
						.where({
							id: user.id
						})
						.update({
							stripe_customer_id: card.customer,
							stripe_card_id: card.id
						})
						.then(function (num) {
							res.status(200).send({})
						})
				}
				else {
					var newWallet = new blockchain.CreateWallet(password, config.blockchain)
					newWallet.create(function (err, wallet) {
						console.log("Email: " + user.email)
						console.log("GUID: " + wallet.guid)
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
				}
			})
			.catch(function (err) {
				next(err)
			})
	}
}
