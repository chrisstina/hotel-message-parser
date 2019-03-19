var Parser = require('./parser');
const hotelMessageAttachment = require('./../model/hotelmessageattachment');

class Ostrovok extends Parser {

    getMessageType (message) {
        return (/Подтверждение бронирования /isu.test(message.subject)) ?
            Parser.messageTypes.INVOICE :
            Parser.messageTypes.OTHER;
    }

    getOrderId (message, messageType) {
        let found = /Подтверждение бронирования № (\d+)/isu.exec(message.subject);
        if (found !== null && found[1] !== undefined) {
            return Promise.resolve(found[1]);
        }
        return Promise.reject('В сообщении не найден order id');
    }

    getAttachmentType(filename) {
        return /invoice-/isu.test(filename) ?
            hotelMessageAttachment.prototype.attachmentTypes.INVOICE :
            hotelMessageAttachment.prototype.attachmentTypes.OTHER;
    }
}

module.exports = function(provider) {
    return new Ostrovok(provider);
};