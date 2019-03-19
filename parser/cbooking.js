var Parser = require('./parser');

const hotelMessageAttachment = require('./../model/hotelmessageattachment');

class CBooking extends Parser {

    getMessageType (message) {
        let r = new RegExp('Cbooking: подтверждение заказа');
        return (r.test(message.subject)) ?
            Parser.messageTypes.INVOICE :
            Parser.messageTypes.OTHER;
    }

    getOrderId (message, messageType) {
        let regexp = /(?:Cbooking: подтверждение заказа №)(\d+)/isu;
        let found = regexp.exec(message.subject);
        if (found !== null && found[1] !== undefined) {
            let finalOrderId = found[1].replace('/', '');
            return Promise.resolve(finalOrderId);
        }
        return Promise.reject('В сообщении не найден order id');
    }

    getAttachmentType(filename) {
        return /Счет на оплату/isu.test(filename) ?
            hotelMessageAttachment.prototype.attachmentTypes.INVOICE :
            hotelMessageAttachment.prototype.attachmentTypes.OTHER;
    }
}

module.exports = function(provider) {
    return new CBooking(provider);
};