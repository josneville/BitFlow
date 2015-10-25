var config = require('../../config')
var request = require('superagent')

module.exports = {
	checkFraud: function (req, res, next) {
		
		var auth = 'Basic ' + new Buffer(config.feedzai + ':').toString('base64');
		var user = res.locals.user

		request
		.post('https://sandbox.feedzai.com/v1/payments')
		.set('Authorization', auth)
		.set('Content-Type', 'application/json')
		.send({ 
			user_id: user.id,
			user_fullname: user.name,
			amount: req.body.amount
		})
		.end(function(err, response){
			if (err) return next(err)
			var body = JSON.parse(response.text)
			console.log(body.explanation.likelyFraud)
			if (body.explanation.likelyFraud){
				var e = new Error()
				e.status = 403
				e.message = 'Suspicious Acitvity'
				return next(e)
			} else {
				return next()
			}
		})
	}

}