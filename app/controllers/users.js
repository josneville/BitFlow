var config = require('../../config')
var request = require('superagent')
var blockchain = require('blockchain.info')

var knex = require('knex')({client: 'postgresql', connection: config.postgres})
var stripe = require('stripe')(config.stripe)

module.exports = {
  balance: function(req, res, next){
    var user = res.locals.user
    var pass = req.body.password

    request
    .get('https://blockchain.info/merchant/' + user.blockchain_wallet + '/balance?password=' + pass)
    .end(function(err, response){
      if (err) return next(err)
      res.status(200).send({balance: response.balance})
    })
  },
  account: function(req, res, next){
    var user = res.locals.user
    var card = req.body.card
    var password = req.body.password

    stripe.accounts.create({
      managed: true,
      country: 'US',
      email: user.email
    }, function(err, account){
      if (err) return next(err)
      stripe.accounts.createExternalAcccount(account.id, {
        external_account: card,
        default_for_currency: true
      }, function(err, bank_account){
        if (err) return next(err)
        var newWallet = new blockchain.CreateWallet(password, config.blockchain)
        newWallet.create(function(err, wallet){
          if (err) return next(err)
          knex('users')
            .where({
              id: user.id
            })
            .update({
              blockchain_wallet: wallet.guid,
              stripe_account: account.id,
              stripe_key: account.keys.secret
            })
            .then(function(){
              res.status(200).send({})
            })
            .catch(function(err){
              next(err)
            })
        })
      })
    })
  }
}
