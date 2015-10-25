var config = require('../../config')
var knex = require('knex')({client: 'postgresql', connection: config.postgres})

var getBalance = require('../services/balance')
var sendMoney = require('../services/sendMoney')

var coinbase = require('../services/coinbase')

module.exports= {
  get: function(req, res, next){
    var user = res.locals.user

    knex('transactions')
    	.join('users', function(){
        this.on('transactions.from_id', '=', 'users.id').orOn('transactions.to_id', '=', 'users.id')
      })
      .select('users.facebook_id', 'users.picture', 'users.name', 'transactions.amount', 'transactions.message')
    	.then(function(rows){
    		res.status(200).send({transactions: rows})
    	})
    	.catch(function(err){
    		next(err)
    	})
  },
  create: function(req, res, next){
    var user = res.locals.user
    var toUser = res.locals.toUser

    var amount = req.body.amount
    var password = config.password //req.body.password
    var message = req.body.message

    sendMoney(user, password, toUser, amount, message, function(err, response){
      if (err) return next(err)
      if (response.error){
        coinbase.buyAndTransfer(amount, toUser, function(err){
          if (err) return next(err)
          return res.status(200).send({})
        })
      }
      else {
        res.status(200).send({})
      }
    })
  }
}
