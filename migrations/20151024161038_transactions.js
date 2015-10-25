exports.up = function(knex, Promise) {
  return knex.schema.createTable('transactions', function(table){
    table.increments('id').primary()
    table.integer('from_id').references('users.id')
    table.integer('to_id').references('users.id')
    table.float('amount')
    table.string('message')
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions')
};
