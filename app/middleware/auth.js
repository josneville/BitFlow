var request = require('superagent')

module.exports = {
	isLoggedIn: function(req, res, next) {
		var facebook_token = req.headers['x-facebook-token']
		request
		.get('https://graph.facebook.com/me?fields=id,email,name&access_token=' + facebook_token)
		.end(function(err, response){
		    if (err) return next(err)
				var body = JSON.parse(response.text)
				return next()
		})
	}
}
