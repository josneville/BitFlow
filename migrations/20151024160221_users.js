exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary()
    table.string('facebook_id')
    table.string('wallet')
    table.string('bank_account')
    table.string('email')
    table.string('name')
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
