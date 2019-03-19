
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('attachment_file'),
        knex.schema.alterTable('hotel_message_attachment', table => {
            table.specificType('content', 'longblob').notNullable();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('hotel_message_attachment', table => {
            table.dropColumn('content');
        }),
        knex.schema.createTable('attachment_file', table => {
            table.string('attachment_id').notNullable();
            table.specificType('content', 'longblob').notNullable();
            table.engine('archive');
        })
    ]);
};
