module.exports = {
  tableName: 'users',
  build: function (table) {
    table.increments('id').primary()
    table.string('facebook_id')
    table.string('wallet')
    table.string('email')
    table.string('name')
  }
}
