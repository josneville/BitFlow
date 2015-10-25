var request = require('superagent')

module.exports = function(user, amount, cb){
	request
		.post('https://sandbox.feedzai.com/v1/payments')
		.set('Content-Type', 'application/json')
		.set('Authorization', 'Basic MDE1NDQ2MWY1ZTU0YTQ4ZTAwMDAwMDAwN2NkZDM2ZWFkMzMyOGYyNDg5MDY4NDM1NDQ3MWM5ZDljZTBhMjY5ZTo=')
		.send({
			user_id: user.id,
			amount: amount
		})
}
