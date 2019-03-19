const config = require('./../config');
const knex = require('knex')(config.db);
const logger = require('./../logger')('MODEL');

const tableName = 'processed_message';
var ProcessedMessage = function () {
};

/**
 * Выбирает все существующие записи из списка полученных сообщений
 *
 * @param messageIds
 * @returns {*|Promise}
 */
ProcessedMessage.prototype.listAll = function (messageIds, mailbox) {
    return knex.select('message_id').from(tableName)
        .where('mailbox', mailbox)
        .whereIn('message_id', messageIds);
};

/**
 * Добавляет сообщение в список обработанных в БД.
 * @param messageId
 * @returns {*|PromiseLike<void>|Promise<void>}
 */
ProcessedMessage.prototype.add = function(messageId, mailbox) {
    return knex(tableName).insert([
        {'message_id': messageId, 'mailbox': mailbox, 'date': new Date()}
    ]).then(() => logger.info('Сохранили сообщение #' + messageId + '/' + mailbox + ' в обработанных'));
};

module.exports = new ProcessedMessage();