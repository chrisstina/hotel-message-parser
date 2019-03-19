
exports.up = function(knex, Promise) {
    return knex.schema.createTable('processed_message', table => {
        table.increments('id').primary();
        table.string('message_id').notNullable();
        table.string('mailbox').notNullable();
        table.dateTime('date').notNullable();
        table.index('message_id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('processed_message');
};
