
exports.up = function(knex, Promise) {
    return knex('hotel_provider').insert([{
        title: 'CBOOKING',
        fromEmail: 'noreply@cbooking.ru'
    }]);
};

exports.down = function(knex, Promise) {
    return knex('hotel_provider')
        .where('title', 'CBOOKING')
        .delete();
};
