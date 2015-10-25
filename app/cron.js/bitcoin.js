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
		async.for(receivers, function (receiver, cb) {
      knex('users')
        .where({
          email: receiver.email
        })
        .then(function(rows){
          var user = rows[0]
          if (receiver.filled) {
    				stripe.charges.create({
    					amount: receiver.amount,
    					currency: receiver.currency,
    					source: receiver.id
    				}, function (err, charge) {
    					if (err) throw err
    					else {
    						stripe.transfers.create({
    							amount: receiver.amount,
    							currency: receiver.currency,
    							destination: user.stripe_card_id
    						}, function (err, transfer) {
    							if (err) throw err
                  cb()
    						})
    					}
    				})
    			}
          else {
            cb()
          }
        })
        .catch(function(err){
          cb(err)
        })
		}, function(err){

    })
	})
})
