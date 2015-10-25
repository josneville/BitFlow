var controllers = require('./controllers')
var middleware = require('./middleware')

module.exports = function(app) {
	app.get('/users/balance', middleware.auth.isLoggedIn, controllers.users.balance)
	app.put('/users/account', middleware.auth.isLoggedIn, controllers.users.account)

	app.get('/transactions', middleware.auth.isLoggedIn, controllers.transactions.get)
}
