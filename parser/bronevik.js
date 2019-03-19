var Parser = require('./parser');
const hotelMessageAttachment = require('./../model/hotelmessageattachment');

class Bronevik extends Parser {

    getMessageType (message) {
        return (/Счёт для оплаты заказа /isu.test(message.subject) ||
            /Услуга #(?:\d+) \(заказ #(\d+)\)/isu.exec(message.html)) ?
            Parser.messageTypes.INVOICE :
            Parser.messageTypes.OTHER;
    }

    getOrderId (message, messageType) {
        let foundInvoice = /Счёт для оплаты заказа #(\d+)/isu.exec(message.subject);
        if (foundInvoice !== null && foundInvoice[1] !== undefined) {
            return Promise.resolve(foundInvoice[1]);
        }

        let foundConfirm = /Услуга #(?:\d+) \(заказ #(\d+)\)/isu.exec(message.html);
        if (foundConfirm !== null && foundConfirm[1] !== undefined) {
            return Promise.resolve(foundConfirm[1]);
        }

        return Promise.reject('В сообщении не найден order id');
    }

    getAttachmentType(filename) {
        return /invoice_for/isu.test(filename) || /confirm_/isu.test(filename) ?
            hotelMessageAttachment.prototype.attachmentTypes.INVOICE :
            hotelMessageAttachment.prototype.attachmentTypes.OTHER;
    }
}

module.exports = function(provider) {
    return new Bronevik(provider);
};