const config = require('./config');
const contentDisposition = require('content-disposition');
const hotelMessageAttachment = require('./model/hotelmessageattachment');
const restify = require('restify');
const restifyErrors = require('restify-errors');
const restifyPlugins = require('restify-plugins');
const logger = require('./logger')('API');

// ROUTES

let defineRoutes = function (server) {

    /**
     * LIST attachments
     */
    server.get('/attachments/:order_id', (req, res, next) => {
        hotelMessageAttachment.prototype.listAllForOrder(req.params.order_id)
        .then((attachmentIds) => {
            res.send(200, attachmentIds);
            return next();
        })
        .catch(err => {
            logger.error(err);
            return next(err);
        });
    });

    /**
     * DOWNLOAD attachment
     */
    server.get('/file/download/:file_id', (req, res, next) => {
        return hotelMessageAttachment.prototype.getByFileId(req.params.file_id)
        .then(attachment => {

            if (attachment === undefined) {
                return next(new restifyErrors.NotFoundError());
            }

            res.send(200, attachment.content, {
                'Content-type': attachment.contentType,
                'Content-Disposition':  contentDisposition(attachment.filename),
                'Transfer-Encoding': 'chunked'
            });
            return next();
        })
        .catch(err => {
            logger.error(err);
            return next(new restifyErrors.InternalServerError("Не удалось скачать файл"));
        });
    });
};

module.exports = {
    start: function () {
        const server = restify.createServer({
            name: config.api.name,
            version: config.api.version,
        });

        server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
        server.use(restifyPlugins.acceptParser(server.acceptable));
        server.use(restifyPlugins.authorizationParser());
        server.use(restifyPlugins.queryParser({ mapParams: true }));
        server.use(restifyPlugins.fullResponse());

        // Авторизация
        server.use(function (req, res, next) {
            if (req.username == 'anonymous' || req.authorization.basic.username != config.api.username  || req.authorization.basic.password !== config.api.password) {
                return next(new restifyErrors.ForbiddenError());
            } else {
                return next();
            }
        });

        server.listen(config.api.port, () => {
            defineRoutes(server);
            logger.info(`[API.INFO] API Server is listening on port ${config.api.port}`);
        });
    }
};