var config = require('../../config')
var stripe = require('stripe')(config.stripe)

var Client = require('coinbase').Client;
var client = new Client({
	'apiKey': config.coinbase.key,
	'apiSecret': config.coinbase.secret
})

module.exports = {
	buyAndTransfer: function (amount, toUser, cb) {
		//charge the current card with stripe
		client.getAccounts({}, function (err, accounts) {
			client.getAccount(accounts[0].id, function (err, account) {
				account.buy({
					amount: amount,
					currency: "USD"
				}, function (err, xfer) {
					// if (err) return cb(err)
					account.sendMoney({
						to: toUser.bitcoin_address,
						amount: amount,
						currency: "USD"
					}, function (err, txn) {
						if (err) return cb(err)
						return cb()
					})
				})
			})
		})
	}
}
