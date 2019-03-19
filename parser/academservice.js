var Parser = require('./parser');

const hotelMessageAttachment = require('./../model/hotelmessageattachment');

class Academservice extends Parser {

    getMessageType (message) {
        let r = new RegExp('(Счет по заказу|Уведомление о состоянии заказа)');
        return (r.test(message.subject)) ?
            Parser.messageTypes.INVOICE :
            Parser.messageTypes.OTHER;
    }

    getOrderId (message, messageType) {
        let regexp = messageType === Parser.messageTypes.INVOICE ?
            /(?:Счет по заказу|Уведомление о состоянии заказа) (\d+[\/-]*\d+)/isu :
            /заказ.* (\d+[\/-]*\d+)/isu;

        let found = regexp.exec(message.subject);
        if (found !== null && found[1] !== undefined) {
            let finalOrderId = found[1].replace('/', '');
            return Promise.resolve(finalOrderId);
        }
        return Promise.reject('В сообщении не найден order id');
    }

    getAttachmentType(filename) {
        return /Счет по заказу/isu.test(filename) ?
            hotelMessageAttachment.prototype.attachmentTypes.INVOICE :
            hotelMessageAttachment.prototype.attachmentTypes.OTHER;
    }
}

module.exports = function(provider) {
    return new Academservice(provider);
};