exports.up = function (knex, Promise) {
    return knex('hotel_provider')
        .where('title', 'BRONEVIK')
        .update({
            fromEmail: '@bronevik.ru',
        });
};

exports.down = function (knex, Promise) {
    return knex('hotel_provider')
        .where('title', 'BRONEVIK')
        .update({
            fromEmail: '*@bronevik.ru',
        });
};
