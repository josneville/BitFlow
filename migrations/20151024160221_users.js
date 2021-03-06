exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary()
    table.string('facebook_id')
    table.string('blockchain_wallet')
    table.string('bitcoin_address')
    table.string('stripe_customer_id')
    table.string('stripe_card_id')
    table.string('email')
    table.string('name')
    table.text('picture')
    table.timestamps()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
