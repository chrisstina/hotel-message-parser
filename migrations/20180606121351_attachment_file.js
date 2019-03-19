
exports.up = function(knex, Promise) {
    return knex.schema.createTable('attachment_file', table => {
        table.string('attachment_id').notNullable();
        table.specificType('content', 'longblob').notNullable();
        table.engine('archive');
    });
};

exports.down = function(knex, Promise) {
  
};
