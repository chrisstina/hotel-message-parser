var Parser = require('./parser');
const hotelMessageAttachment = require('./../model/hotelmessageattachment');

class Hotelbookpro extends Parser {

    getMessageType (message) {
        return (/В заказ загружен счет/isu.test(message.subject) || message.attachments.length > 0) ?
            Parser.messageTypes.INVOICE :
            Parser.messageTypes.OTHER;
    }

    getOrderId (message, messageType) {
        let found = /(?:Номер заказа: (\d+)|Заказ №(\d+))/isu.exec(message.html || message.text);
        if (found !== null && (found[1] !== undefined || found[2] !== undefined )) {
            return Promise.resolve(found[1] || found[2]);
        }
        return Promise.reject('В сообщении не найден order id');
    }

    getAttachmentType(filename) {
        return /order_/isu.test(filename) ?
            hotelMessageAttachment.prototype.attachmentTypes.INVOICE :
            hotelMessageAttachment.prototype.attachmentTypes.OTHER;
    }
}

module.exports = function(provider) {
    return new Hotelbookpro(provider);
};