const config = require('./config');
const http = require('http');
const logger = require('./logger')('APP');

// === чтение почтовых ящиков ===
require('./mailchecker').start();

// === обслуживание REST API - отключено, т.к. шлюз выводит файлы сам ===
//require('./api').start();

// === вместо этого просто запускаем сервер ===
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Go home.');
    res.end();
}).listen(config.api.port, () => {
    logger.info(`Server is listening on port ${config.api.port}`);
});

// gitlab test update after mirror asana test