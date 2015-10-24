var controller = require('./controllers')
var middleware = require('./middleware')
var services = require('./services')

module.exports = function(app) {
	app.get('/api/app/login', middleware.auth.isLoggedIn)
}
