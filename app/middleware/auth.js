var config = require('../../config')
var request = require('superagent')

var knex = require('knex')({client: 'postgresql', connection: config.postgres})

module.exports = {
	isLoggedIn: function(req, res, next) {
		var facebook_token = req.headers['x-facebook-token']
		request
		.get('https://graph.facebook.com/me?fields=id,email,name&access_token=' + facebook_token)
		.end(function(err, response){
		    if (err) return next(err)
			var body = JSON.parse(response.text)
			knex('users')
				.where({
					facebook_id: body.id
				})
				.then(function(rows){
					if (rows.length === 0) {
						return knex('users').insert({
							facebook_id: body.id,
							email: body.email,
							name: body.name
						})
					}
					res.locals.user = rows[0]
					return next()
				})
				.then(function(){
					return knex('users').where({
						facebook_id: body.id
					})
				})
				.then(function(rows){
					res.locals.user = rows[0]
					return next()
				})
				.catch(function(err){
					return next(err)
				})
		})
	}
}
