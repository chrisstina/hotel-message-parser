
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('hotel_message', table => {
            table.index('message_id');
        }),
        knex.schema.alterTable('hotel_message', table => {
            table.index('order_id');
        }),
        knex.schema.alterTable('hotel_message', table => {
            table.index('provider_order_id');
        }),
        knex.schema.alterTable('hotel_message_attachment', table => {
            table.index('message_id');
        })
    ]);



};

exports.down = function(knex, Promise) {
  
};
