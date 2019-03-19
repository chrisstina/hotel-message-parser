
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('hotel_message_attachment', table => {
        table.dropColumn('createdDate');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('hotel_message_attachment', table => {
        table.string('createdDate').notNullable().defaultTo(new Date());
    });
};
