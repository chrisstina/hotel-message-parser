
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('hotel_provider', table => {
        table.dropColumn('toEmail');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('hotel_provider', table => {
        table.string('toEmail').notNullable();
    });
};
