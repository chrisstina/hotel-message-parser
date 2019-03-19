
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('hotel_message', table => {
        table.dropIndex('message_id');
        table.string('message_id').notNullable().defaultTo(0).alter();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('hotel_message', table => {
        table.text('message_id').string('message_id').notNullable().alter();
        table.index('message_id');
    });
};
