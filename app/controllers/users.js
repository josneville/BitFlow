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
    var password = req.body.password

    getBalance(user, password, function(err, balance){
      if (err) return next(err)
      return res.status(200).send({balance: balance})
    })
	},
	account: function (req, res, next) {
		var user = res.locals.user
		var bank = req.body.bank
		var card = req.body.card

		var password = req.body.password
		stripe.customers.create({
				email: user.email,
				source: card
			})
			.then(function (customer) {
				return stripe.accounts.create({
					managed: true,
					country: 'US',
					email: user.email
				})

			})
			.then(function (account) {
				return stripe.accounts.createExternalAccount(account.id, {
					external_account: bank,
					default_for_currency: true
				})
			})
			.then(function (bank_account) {
				var newWallet = new blockchain.CreateWallet(password, config.blockchain)
				newWallet.create(function (err, wallet) {
					return knex('users')
						.where({
							id: user.id
						})
						.update({
							blockchain_wallet: wallet.guid,
              stripe_customer_id: customer.id,
							stripe_account_id: account.id,
							stripe_key_id: account.keys.secret
						})
				})
			})
			.then(function (num) {
				res.status(200).send({})
			})
			.catch(function (err) {
				next(err)
			})
	}
}
