var controller = require('./controllers')
var middleware = require('./middleware')
var services = require('./services')

module.exports = function(app) {
	app.get('/users/balance', middleware.auth.isLoggedIn, controllers.users.balance)
	app.get('/transactions', middleware.auth.isLoggedIn, controllers.transactions.get)
}
