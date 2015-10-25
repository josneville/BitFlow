var config = require('../../config')
var knex = require('knex')({
	client: 'postgresql',
	connection: config.postgres
})
var stripe = require('stripe')(config.stripe)

var getBalance = require('../services/balance')
var sendMoney = require('../services/sendMoney')

var coinbase = require('../services/coinbase')

module.exports = {
	get: function (req, res, next) {
		var user = res.locals.user

		knex('transactions')
			.join('users as from', 'from.id', 'transactions.from_id')
      .join('users as to', 'to.id', 'transactions.to_id')
			.select('from.facebook_id as from_facebook', 'from.picture as from_picture', 'from.name as from_name', 'to.facebook_id as to_facebook', 'to.picture as to_picture', 'to.name as to_name', 'transactions.amount', 'transactions.message')
			.then(function (rows) {
				res.status(200).send({
					transactions: rows
				})
			})
			.catch(function (err) {
				next(err)
			})
	},
	create: function (req, res, next) {
		var user = res.locals.user
		var toUser = res.locals.toUser

		var amount = req.body.amount
		var password = config.password //req.body.password
		var message = req.body.message
		var user = res.locals.user
		stripe.charges.create({
			amount: amount * 100, // amount in cents, again
			currency: "usd",
			customer: user.stripe_customer_id
		}, function (err, charge) {
			if (err) return next(err)
			sendMoney(user, password, toUser, amount, message, function (err, response) {
				if (err) return next(err)
				if (response.error) {
					coinbase.buyAndTransfer(amount, toUser, function (err) {
						if (err) return next(err)
						return res.status(200).send({})
					})
				} else {
					res.status(200).send({})
				}
			})
		})
	}
}
