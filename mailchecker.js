const config = require('./config');
const hotelProvider = require('./model/hotelprovider');
const mailbox = require('./service/mailbox');
const messageProcessor = require('./service/messageprocessor');
const logger = require('./logger')('MAIL');

// trust all certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let checkMailbox = function(config) {
    logger.info('Подключаемся к ' + config.user);
    return mailbox.listNewMessages(config)
        .then(list => mailbox.fetchNewMessages(list, config))  // результат парсинга - массив готовых для работы объект сообщения
        .then(mails => messageProcessor.processAll(mails)) // здесь достаем сообщения отелей, сохраняем и вешаем таск в gearman
        .catch(err => logger.error(err));
};

module.exports = {
    /**
     * Запускает процесс проверки и обраотки настроенных почтовых ящиков с определенной периодичностью
     */
    start: function() {
        try {
            logger.info('Начинаем проверять почту...');
            config.mailboxes.map((mailbox, idx) => {
                setTimeout(
                    () => { setInterval(() => { checkMailbox(mailbox)}, config.checkPeriod); },
                    idx * (config.checkPeriod / 2)
                );
            });
        } catch (err) {
            logger.error('Не удалось запустить почтовый клиент, ошибка: ' + err);
        }
    }
}