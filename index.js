const logger = require('pelias-logger').get('api');
const type_mapping = require('./helper/type_mapping');

const app = require('./app'),
  port = (process.env.PORT || 3100),
  host = (process.env.HOST || undefined),
  keepAliveTimeout = Number(process.env.KEEP_ALIVE_TIMEOUT || '5000');

let server;

// load Elasticsearch type mappings before starting web server
type_mapping.load(() => {
  server = app.listen(port, host, () => {
    // ask server for the actual address and port its listening on
    const listenAddress = server.address();
    logger.info(`pelias is now running on http://${listenAddress.address}:${listenAddress.port}`);
  });
  server.keepAliveTimeout = keepAliveTimeout;
});

function exitHandler() {
  logger.info('Pelias API shutting down');

  server.close();
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
