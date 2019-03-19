const appConfig = require('../config');
const processedMessage = require('../model/processedmessage');
const Pop3Command = require('node-pop3');
const simpleParser = require('mailparser').simpleParser;
const logger = require('./../logger')('POP3');

/**
 * Создает экземпляр POPCommand
 * @param config
 * @returns {Pop3Command}
 */
let getPOPCommand = function (config) {
    return new Pop3Command({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        debug: true
    });
};

/**
 * Цепочка промисов, получаем RAW сообщение
 *
 * @param messageId
 * @param config
 * @returns {Promise<T>}
 */
let fetchMessage = function (messageId, config) {
    let pop3 = getPOPCommand(config);

    return pop3.RETR(messageId)
        .then((stream) => {
            return stream;
        })
        .then((stream) => {
            pop3.QUIT();
            return stream;
        })
        .catch(err => {
            logger.error(err);
            return pop3.QUIT();
        });
};

/**
 * Из всего списка сообщений в ящике возвращает те, которые не были обработаны
 *
 * @param list - все сообщения ящика
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
let filterNew = function (list, mailbox) {
    const popIdx = 1; // индекс поля в UIDL, которое будем использовать для сравнения
    let messageIds = list.map((id) => { return id[popIdx]; });

    return processedMessage.listAll(messageIds, mailbox)
        .then((rows) => {
            let processedIds = rows.map((row) => { return row['message_id']; });

            return list.filter(listItem => {
                return processedIds.indexOf(listItem[popIdx]) === -1;
            }).map(newListItem => {
                return {retrieveID: newListItem[0], uniqueID: newListItem[popIdx]};
            });
        })
        .catch((err) => {
            logger.error(err);
            return [];
        });
};

module.exports = {
    /**
     * Получает список сообщений из ящика, которые еще не были обработаны
     * @param config
     * @returns {Promise<T>}
     */
    listNewMessages: function (config) {
        let pop3 = getPOPCommand(config);
        let newMessages = [];

        return pop3.UIDL()
            .then((list) => {
                pop3.QUIT();
                return list;
            })
            .then((list) => {
                return filterNew(list, config.user);
            })
            .catch((err) => {
                pop3.command('QUIT');
                logger.error(err);
            });
    },

    /**
     * Получает список распарсенных объектов почтовых сообщений
     *
     * @param messageIds [{retrieveID, uniqueID}]
     * @returns {Promise<[any , any , any , any , any , any , any , any , any , any] | void>}
     */
    fetchNewMessages: function (messageIds, config) {

        // Не обрабатываем сразу все, а кусочками.
        // Следующая партия будет обработана при следующей итерации.
        let messageSlice = messageIds.slice(0, appConfig.messageChunkSize);

        return Promise.all( // получаем все новые письма, параллельно
            messageSlice.map((mid) => {
                return fetchMessage(mid['retrieveID'], config).then(result => {
                    return processedMessage.add(mid['uniqueID'], config.user).then(() => { return result });
                });
            })
        )
        .then((streams) => { // как только получили все письма - парсим все, параллельно
            return Promise.all(
                streams.map((stream) => {
                    return simpleParser(stream);
                })
            );
        })
        .catch(err => logger.error(err));
    }
};