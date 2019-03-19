
exports.up = function(knex, Promise) {
    return knex.schema.createTable('hotel_message_attachment', table => {
        table.increments('id').primary();
        table.string('message_id').notNullable();
        table.string('attachment_id').notNullable();
        table.tinyint('provider_id').notNullable();
        table.enum('type', ['INVOICE', 'OTHER']).notNullable().defaultTo('OTHER');
        table.string('createdDate').notNullable().defaultTo(new Date());
        table.string('filename').nullable();
        table.string('contentType').nullable();
        table.charset('utf8');
        table.collate('utf8_general_ci');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('hotel_message_attachment');
};
