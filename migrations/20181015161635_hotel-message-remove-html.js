
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('hotel_message', table => {
        table.dropColumn('html');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('hotel_message', table => {
        table.text('html').nullable();
    });
};
