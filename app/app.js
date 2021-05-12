const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const history = require('connect-history-api-fallback');
const cookieParser = require('cookie-parser');
const config = require('config');
const Routes = require('./routes');
const logger = require('./common/logger');
const keycloak = require('./middleware/keycloak');
const socketClient = require('./socket');

const app = express();
const server = http.createServer(app);

server.timeout = 0; // set server timeout to infinity.

// Middleware to support the HTML5 history mode routing on the client side
app.use(history({
  rewrites: [{
    from: /^\/api\/.*$/,
    to: (context) => context.parsedUrl.path,
  }],
}));

app.use(bodyParser.json({
  limit: '100mb',
}));
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, '../public/dist')));
app.use(keycloak.middleware());
app.use('/', new Routes());

server.listen(config.server.port, (err) => {
  if (err) logger.fatal('Error while starting server!!', err);
  else {
    logger.info('Server started and listening on Port:', config.server.port);
  }
});

process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection....', reason);
});
