var controller = require('./controllers')
var middleware = require('./middleware')
var services = require('./services')


services.manager.sync()

module.exports = function(app) {
	app.get('/api/app/login', middleware.auth.isLoggedIn) 
}
