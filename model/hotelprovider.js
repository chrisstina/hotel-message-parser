const config = require('./../config');
const knex = require('knex')(config.db);
const tableName = 'hotel_provider';

var HotelProvider = function (row) {
    if (row !== undefined) {
        this.id = row.id;
        this.title = row.title;
        this.fromEmail = row.fromEmail;
    }

    this.tableName = tableName;
};

HotelProvider.prototype.getByTitle = function (title) {
    return knex(tableName).where({title: title}).first()
        .then(row => {
            if (row === undefined) {
                throw new Error('Provider ' + title + ' not found in DB!');
            }
            return new HotelProvider(row);
        });
};

/**
 * Находит запись о провайдере по отправителю
 * @param mailaddress
 * @return {*|PromiseLike<T>|Promise<T>}
 */
HotelProvider.prototype.getByMailAddress = function (mailaddress) {
    let mailparts = mailaddress.split('@'),
        maildomain = mailparts[1] || 'undefined';
    return knex(tableName).where('fromEmail', 'like', '%' + maildomain).first()
        .then(row => {
            if (row === undefined) {
                throw new Error('Не найден провайдер по отправителю ' + mailaddress);
            }
            return new HotelProvider(row);
        });
};

module.exports = new HotelProvider();