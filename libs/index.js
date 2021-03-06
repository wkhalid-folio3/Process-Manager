var log = (require('./f3-logger')).initiateLog('pino');
var app = require('express')();
var bodyParser = require('body-parser');
var processManager = require('./process-manager');
app.use(log.requestLogger());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
module.exports = {
    log: log,
    express: app,
    forkJob: processManager.forkJob
}