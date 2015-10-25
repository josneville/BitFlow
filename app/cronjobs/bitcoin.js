var config = require('../../config')

var CronJob = require('cron').CronJob
var async = require('async')
var stripe = require('stripe')(config.stripe)
var knex = require('knex')({
	client: 'postgresql',
	connection: config.postgres
})

new CronJob('15 * * * * *', function () {
	stripe.bitcoinReceivers.list({}, function (err, receivers) {
		async.each(receivers.data, function (receiver, cb) {
			knex('users')
				.where({
					email: receiver.email
				})
				.then(function (rows) {
					var user = rows[0]
					if (receiver.filled && !receiver.used_for_payment) {
						stripe.charges.create({
							amount: receiver.amount,
							currency: receiver.currency,
							source: receiver.id
						}, function (err, charge) {
							console.log(err)
							if (!err) {
								stripe.transfers.create({
									amount: receiver.amount,
									currency: receiver.currency,
									destination: user.stripe_card_id
								}, function (err, transfer) {
									console.log(err)
									if (!err) console.log("Bitcoin receiver fulfilled")
									cb()
								})
							}
						})
					} else {
						cb()
					}
				})
				.catch(function (err) {
					cb(err)
				})
		}, function (err) {
			console.log(err)
		})
	})
}, null, true, 'America/Los_Angeles')
