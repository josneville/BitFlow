var config = require('../../config')
var knex = require('knex')({client: 'postgresql', connection: config.postgres})

module.exports = {
  findToUser: function(req, res, next){
    var facebook_id = req.params.facebook_id

    knex('users')
      .where({
        facebook_id: facebook_id
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
