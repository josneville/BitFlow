var controllers = require('./controllers')
var middleware = require('./middleware')

module.exports = function(app) {
	require('./cronjobs/bitcoin')

	app.get('/users/balance', middleware.auth.isLoggedIn, controllers.users.balance)
	app.put('/users/account', middleware.auth.isLoggedIn, controllers.users.account)
	app.post('/users/withdraw', middleware.auth.isLoggedIn, controllers.users.withdraw)

	app.get('/users/transactions', middleware.auth.isLoggedIn, controllers.transactions.get)
	app.post('/users/transactions/:facebook_id', middleware.auth.isLoggedIn, middleware.transactions.findToUser, controllers.transactions.create)
}
