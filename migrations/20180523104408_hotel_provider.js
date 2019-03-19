
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('hotel_provider', table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.string('toEmail').notNullable();
            table.string('fromEmail').notNullable();
        })
        .then(() => {
            return knex('hotel_provider').insert([{
                title: 'BRONEVIK',
                toEmail: '',
                fromEmail: '*@bronevik.ru'
            },
            {
                title: 'ACADEMSERVICE',
                toEmail: '',
                fromEmail: 'hotelarc@acase.ru'
            },
            {
                title: 'OSTROVOK',
                toEmail: '',
                fromEmail: 'donotreply@b2bmail.ostrovok.ru'
            }]);
        })
    ]);
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('hotel_provider');
};
