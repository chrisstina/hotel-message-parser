
exports.up = function(knex, Promise) {
    return knex('hotel_provider').insert([{
        title: 'HOTELBOOKPRO',
        fromEmail: 'info@hotelbook.ru'
    }]);
};

exports.down = function(knex, Promise) {
    return knex('hotel_provider')
        .where('title', 'HOTELBOOKPRO')
        .delete();
};
