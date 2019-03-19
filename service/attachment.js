const shortid = require('shortid');
const MessageAttachment = require('../model/hotelmessageattachment');
const logger = require('./../logger')('QUEUE');

/**
 * Сохраняем файл в базу
 *
 * @param provider
 * @param attachment
 * @param messageId
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
let save = function(provider, attachment, messageId, parser) {
    try {
        var filename = shortid.generate(),
            attachmentType = parser.getAttachmentType(attachment.filename);
    } catch (err) {
        return Promise.reject(err);
    }

    return new MessageAttachment(
        messageId,
        provider.id,
        filename,
        attachment.filename,
        attachmentType,
        attachment.contentType,
        attachment.content)
    .save();
};

module.exports = {
    saveAll: function(provider, mail, messageId, parser) {
        logger.info('Сохраняем прикрепленные файлы для письма "' + mail.subject + '" от ' + mail.date);
        return Promise.all(mail.attachments.map(attachment => {
            return save(provider, attachment, messageId, parser);
        }))
        .catch(err => logger.error(err));
    },
};