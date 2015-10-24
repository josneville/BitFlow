var request = require('superagent');

module.exports = {
	isLoggedIn: function(req, res, next) {
		
		var facebook_token = req.headers['X-Facebook-Token']

		request
		.get('https://graph.facebook.com/me?fields=id&access_token=' + facebook_token)
		.end(function(err, response){
		    console.log(response);
		    if (err) return next(err)
		})

		if ()

		if (err) {
			return next(err)
		}
		return next()
	}
}