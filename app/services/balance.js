var request = require('superagent')
var blockchain = require('blockchain.info')

module.exports = function (user, password, cb) {
	var myWallet = new blockchain.MyWallet(user.blockchain_wallet, password)
	myWallet.getBalance({
		inBTC: true
	}, function (err, balance) {
    if (err) return cb(err, null)
		var btcBalance = ((balance) / 100000000)
		request
			.get('https://blockchain.info/ticker')
			.end(function (err, response) {
				if (err) return cb(err, null)
				return cb(null, Math.floor(btcBalance * response.body.USD.last * 100) / 100)
			})
	})
}
