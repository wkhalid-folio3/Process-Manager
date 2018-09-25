var pinoLog = (require('./f3-logger-pino')).log;

const initiateLog = function(logInstance) {
    switch (logInstance) {
        case 'pino':
            return pinoLog;
            break;
        default:
            return {};
            break;

    }
}

module.exports = {
    initiateLog: initiateLog
}