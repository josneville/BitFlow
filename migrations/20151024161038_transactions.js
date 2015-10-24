exports.up = function(knex, Promise) {
  return knex.schema.createTable('transactions', function(table){
    table.increments('id').primary()
    table.string('from_id').references('users.id')
    table.string('to_id').references('users.id')
    table.float('amount')
    table.string('message')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
