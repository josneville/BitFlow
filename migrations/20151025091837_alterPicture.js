
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table){
  	table.text('picture')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table){
  	table.string('picture')
  })
};
