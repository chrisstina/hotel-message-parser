const attachment = require('./attachment');
const config = require('../config');
const Message = require('../model/hotelmessage');
const HotelProvider = require('../model/hotelprovider');
const Parser = require('./../parser/parser');
const queue = require('./queue');
const logger = require('./../logger')('MAILPROC');

/**
 * Сообщения от провайдеров, содержащие счета, парсит, сохраняет order id, сохраняет прикрепленные файлы.
 * Кидает таск в очередь на обработку шлюзом.
 *
 * @param provider - объект провайдера, для кототрого обрабатываем почту
 * @param mail
 * @returns {Promise<void>}
 */
let process = function (mail, provider) {
    let parser = require('./../' + config.parsers[provider.title])(provider);
    let messageType = parser.getMessageType(mail);
    return parser.getOrderId(mail, messageType) // достаем из текста письма order id
        .then((orderId) => { // сохраняем сообщение
            let message = new Message(
                mail.messageId,
                provider.id,
                orderId,
                mail.date,
                mail.from.value[0].name,
                mail.from.value[0].address,
                mail.subject,
                mail.text
            );
            return message.save().then(messageIds => {
                message.id = messageIds[0];
                return message;
            });
        })
        .then(message => { // сохраняем attachments
            if ((mail.attachments.length <= 0)) {
                logger.info('В письме "' + mail.subject + '" нет прикрепленных файлов, пропускаем.');
                return message;
            } else {
                return attachment.saveAll(provider, mail, message.id, parser).then(() => message);
            }
        })
        .then((message) => {
            if (messageType === Parser.messageTypes.INVOICE) {
                logger.info('Получен новый счет или уведомление по заказу #' + message.providerOrderId + ' в ' + provider.title + '. Запрашиваем order id ');
                return queue.enqueueInvoice(message, provider);
            } else {
                logger.info('Получено новое сообщение по заказу #' + message.providerOrderId + ' в ' + provider.title + '. Просто сохраняем в базу.');
                return queue.enqueueNotification(message, provider);
            }
        })
        .catch((err) => {
            logger.error('Ошибка процессинга письма "' + mail.subject + '" ' + err + '. Пропускаем.');
        });
};

module.exports = {
    /**
     * Получает список объектов сообщений.
     * Сообщения от провайдеров, содержащие счета, парсит, сохраняет order id, сохраняет прикрепленные файлы.
     * Кидает таск в очередь на обработку шлюзом.
     *
     * @param mails
     * @returns {Promise<[any , any , any , any , any , any , any , any , any , any]>}
     */
    processAll: function (mails) {
        return Promise.all(mails.map(mail => {
            return HotelProvider.getByMailAddress(mail.from.value[0].address)
            .then(provider => {
                return process(mail, provider)
            })
            .catch((err) => {
                logger.error('Ошибка процессинга письма "' + mail.subject + '" ' + err + '. Пропускаем.');
            });
        }));
    }
}