const config = require('./../config');
const HotelMessage = require('./hotelmessage');
const knex = require('knex')(config.db);
const tableName = 'hotel_message_attachment';

/**
 *
 * @param messageId
 * @param providerId
 * @param attachment_id
 * @param filename
 * @param type
 * @param contentType
 * @param content - binary
 * @constructor
 */
var HotelMessageAttachment = function (messageId, providerId,  attachment_id, filename, type, contentType, content) {
    this.messageId = messageId;
    this.attachmentId = attachment_id;
    this.providerId = providerId;
    this.filename = filename;
    this.contentType = contentType;
    this.content = content;
    this.type = type;
};

HotelMessageAttachment.prototype.attachmentTypes = {
    INVOICE: 'INVOICE',
    OTHER: 'OTHER'
};

/**
 * Сохраняет запись о файле И сам файл в БД
 * @return {*|PromiseLike<T>|Promise<T>}
 */
HotelMessageAttachment.prototype.save = function () {
    return knex(tableName).insert([{
        message_id: this.messageId,
        attachment_id: this.attachmentId,
        filename: this.filename,
        provider_id: this.providerId,
        type: this.type,
        contentType: this.contentType,
        content: this.content
    }]);
};

HotelMessageAttachment.prototype.listAllForOrder = function(orderId) {
    return knex(tableName).leftJoin(HotelMessage.prototype.tableName, function() {
        this.on(tableName + '.message_id', '=', HotelMessage.prototype.tableName + '.id');
    })
    .select('attachment_id', 'filename', 'type', 'contentType', 'createdDate')
    .where({order_id: orderId});
};

HotelMessageAttachment.prototype.getByFileId = function(fileId) {
    return knex(tableName)
    .first(tableName + '.attachment_id', 'contentType', 'filename', 'content')
    .where(tableName + '.attachment_id', fileId);
};

module.exports = HotelMessageAttachment;