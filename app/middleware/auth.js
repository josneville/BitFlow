var config = require('../../config')
var request = require('superagent')

var knex = require('knex')({client: 'postgresql', connection: config.postgres})

module.exports = {
	isLoggedIn: function(req, res, next) {
		var facebook_token = req.headers['x-facebook-token']
		request
		.get('https://graph.facebook.com/me?fields=id,email,name,picture&access_token=' + facebook_token)
		.end(function(err, response){
		  if (err) return next(err)
			var body = JSON.parse(response.text)
			var success = new Error()
			success.status = true
			knex('users')
				.where({
					facebook_id: body.id
				})
				.then(function(rows){
					if (rows.length === 0) {
						return knex('users').insert({
							facebook_id: body.id,
							email: body.email,
							name: body.name,
							picture: body.picture.data.url
						})
					}
					success.rows = rows
					throw success
				})
				.then(function(){
					return knex('users').where({
						facebook_id: body.id
					})
				})
				.then(function(rows){
					success.rows = rows
					throw success
				})
				.catch(function(err){
					if (err.status){
						res.locals.user = success.rows[0]
						next()
					}
					else{
						next(err)
					}
				})
		})
	}
}
