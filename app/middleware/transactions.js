var config = require('../../config')
var knex = require('knex')({client: 'postgresql', connection: config.postgres})

module.exports = {
  findToUser: function(req, res, next){
    var id = req.params.id

    knex('users')
      .where({
        id: id
      })
      .then(function(rows){
        if (rows.length === 0) {
          var e = new Error()
          e.status = 404
          e.message = 'Second user not found'
          throw e
        }
        res.locals.toUser = rows[0]
        next()
      })
      .catch(function(err){
        next(err)
      })
  }
}
