var request = require('superagent');

module.exports = {
	isLoggedIn: function(req, res, next) {
		
		var facebook_token = req.headers['X-Facebook-Token']
		console.log(facebook_token)
		request
		.get('https://graph.facebook.com/me?fields=id&access_token=' + facebook_token)
		.end(function(err, response){
		    console.log(response);
		    if (err) return next(err)
		    return res.status(200).send({'response': response})
		})
	}
}