module.exports = function(user, password, cb){
  request
    .get('https://blockchain.info/merchant/' + user.blockchain_wallet + '/balance?password=' + password)
    .end(function (err, response) {
      if (err) return cb(err, null)
      return cb(null, balance)
    })
}
