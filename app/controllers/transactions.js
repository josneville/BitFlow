var config = require('../../config')
var knex = require('knex')({client: 'postgresql', connection: config.postgres})

module.exports= {
  get: function(req, res, next){
    var user = res.locals.user

    knex('transactions')
    	.where({
    		from_id: user.id
    	})
    	.orWhere({
    		to_id: user.id
    	})
    	.then(function(rows){
    		res.status(200).send({transactions: rows})
    	})
    	.catch(function(err){
    		next(err)	
    	}) 
  }
}
