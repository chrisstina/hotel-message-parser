class Parser {
    constructor(provider) {
        this.provider = provider;
    }

    static get messageTypes() {
        return {
            INVOICE: 'INVOICE',
            OTHER: 'OTHER'
        };
    }

    getMessageType(message) {
        return Promise.reject('Not implemented');
    }

    getAttachmentType(filename) {
        return Promise.reject('Not implemented');
    }

    /**
     * @returns {Promise<never>}
     */
    getOrderId(mail, messageType) {
        return Promise.reject('Not implemented');
    }
}

module.exports = Parser;