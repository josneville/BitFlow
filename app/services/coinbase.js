var config = require('../../config')


var Client = require('coinbase').Client;
var client = new Client({'apiKey': config.coinbase.key, 'apiSecret': config.coinbase.secret})

module.exports = {
  buyAndTransfer: function(amount, toUser, cb){
    client.getAccounts({}, function(err, accounts){
      client.getAccount(accounts[0].id, function(err, account){
        account.buy({
          amount: amount,
          currency: "USD"
        }, function(err, xfer){
          if (err) return cb(err)
          account.sendMoney({
  					to: toUser.bitcoin_address,
  					amount: amount
  				}, function(err, txn){
            if (err) return cb(err)
            return cb()
          })
        })
      })
    })
  }
}
