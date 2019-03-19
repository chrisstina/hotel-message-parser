const config = require('./../config');
const knex = require('knex')(config.db);
const tableName = 'hotel_message';

/**
 *
 * @param messageId
 * @param providerId
 * @param providerOrderId
 * @param date
 * @param fromName
 * @param fromEmail
 * @param subject
 * @param text
 * @param messageType
 * @constructor
 */
var HotelMessage = function (messageId, providerId, providerOrderId, date, fromName, fromEmail, subject, text, messageType) {
    this.messageId = messageId;
    this.providerId = providerId;
    this.providerOrderId = providerOrderId;
    this.date = date;
    this.fromName = fromName;
    this.fromEmail = fromEmail;
    this.subject = subject;
    this.text = text;

    this.type = messageType;
};

HotelMessage.prototype.tableName = tableName;

/**
 *
 * @returns {Promise}
 */
HotelMessage.prototype.save = function() {
    return knex(tableName).insert([
        {
            message_id: this.messageId,
            provider_id: this.providerId,
            provider_order_id: this.providerOrderId,
            date: this.date,
            fromName: this.fromName,
            fromEmail: this.fromEmail,
            subject: this.subject,
            text: this.text,
        }
    ]);
};

/**
 * Устанавливает providerOrderId шлюза для сообщения.
 * @param orderId
 * @return Promise
 */
HotelMessage.prototype.saveOrderId = function(orderId) {
    return knex(tableName)
        .where('id', this.messageId)
        .update('order_id', orderId);
};

module.exports = HotelMessage;