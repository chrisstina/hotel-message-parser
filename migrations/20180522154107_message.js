exports.up = function(knex, Promise) {
    return knex.schema.createTable('hotel_message', table => {
        table.increments('id').primary();
        table.string('message_id').notNullable();
        table.integer('provider_id').notNullable();
        table.string('provider_order_id').notNullable();
        table.string('order_id').nullable();
        table.dateTime('date').notNullable();
        table.string('fromName').notNullable();
        table.string('fromEmail').notNullable();
        table.string('subject').nullable();
        table.text('text').nullable();
        table.text('html').nullable();
        table.charset('utf8');
        table.collate('utf8_general_ci');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('hotel_message');
};
