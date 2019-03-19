const gearman = require('gearman-node');
const config = require('../config');
const gearmanClient = new gearman.Client(config.gearman.options);
const Message = require('../model/hotelmessage');
const logger = require('./../logger')('QUEUE');

/**
 * Обработчик ответа воркера gearman с order id шлюза
 * Сохраняем Order id.
 * @param data
 */
let onWorkComplete = function(data) { // Подписываемся на ответ WORK_COMPLETE data: {messageId, orderId}
    new Message(data.messageId)
        .saveOrderId(data.orderId)
        .then((id) => {
            if (data.orderId === null) {
                logger.error('Не удалось найти заказ для сообщения #' + data.messageId + ' на стороне шлюза.');
            } else {
                logger.info('Сообщение #' + data.messageId + ' ассоциировано с заказом шлюза #' + data.orderId);
            }
        })
        .catch(err => logger.error(err));
};

/**
 *
 * @param message
 * @param q
 * @return {Promise<any>}
 */
let getJobPromise = function(provider, message, q, jobType) {
    return new Promise((resolve, reject) => {
        q.on('created', function (handle) {
            logger.info('Задача ' + jobType + ' отправлена в Gearman, заказ #' + message.providerOrderId + ' в ' + provider.title);
            resolve(message.providerOrderId);
        })
        .on('fail', function (handle) {
            /* @todo retry if fail */
            logger.error('Не удалось отправить или выполнить задачу ' + jobType + ' в Gearman, заказ #' + message.providerOrderId + ' в ' + provider.title);
            reject();
        });
    })
};

module.exports = {
    enqueueNotification: function(message, provider) {
        let q = gearmanClient.submitJob(
            config.gearman.jobs.onNewNotification,
            JSON.stringify({
                messageId: message.id,
                messageText: message.text,
                providerOrderId: message.providerOrderId,
                provider: provider.title
            })
        );
        return getJobPromise(provider, message, q, config.gearman.jobs.onNewNotification);
    },
    enqueueInvoice: function (message, provider) {
        let q = gearmanClient.submitJob(
            config.gearman.jobs.onNewInvoice,
            JSON.stringify({
                messageId: message.id,
                providerOrderId: message.providerOrderId,
                provider: provider.title
            })
        )
        .on('complete', (handle, data) => {
            try {
                if (data !== undefined) {
                    onWorkComplete(JSON.parse(data.toString()));
                } else {
                    logger.error('Нет ответа Gearman.', err);
                    return null;
                }
            } catch (err) {
                logger.error('Ошибка парсинга ответа Gearman.', err);
                return null;
            }
        });

        return getJobPromise(provider, message, q, config.gearman.jobs.onNewInvoice);
    }
};