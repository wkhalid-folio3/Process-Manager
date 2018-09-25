var fs = require('fs');
var multistream = require('pino-multi-stream').multistream;
var pino = require('pino');
const uuidv4 = require('uuid/v4');

var streams = [
    { level: 'debug', stream: fs.createWriteStream('logs/info.stream.out', { flags: 'a' }) },
    { level: 'debug', stream: process.stdout }
    //{ level: 'debug', stream: fs.createWriteStream('/logs/debug.stream.out') },
    //{ level: 'fatal', stream: fs.createWriteStream('/logs/fatal.stream.out') }
];

var serializers = {
    requestSerializer: function(req) {
        if (!req || !req.connection) {
            return req;
        }
        return {
            url: req.url,
            method: req.method,
            protocol: req.protocol,
            requestId: req.requestId,
            ip: req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress,
            headers: req.headers
        };
    },

    responseSerializer: function(res) {
        if (!res) {
            return res;
        }
        return {
            statusCode: res.statusCode,
            headers: res._header,
            requestId: res.requestId,
            responseTime: res.responseTime
        };
    },

    processSerializer: function(obj) {
        return {
            process: obj.process || 'unspecified',
            client: obj.client || 'unspecified',
            system1: obj.system1 || 'unspecified',
            system2: obj.system2 || 'unspecified'
        };
    },

    processDetails: function(obj) {

    }

};

var log = pino({
    level: 'debug',
    serializers: {
        request: serializers.requestSerializer,
        event: serializers.processSerializer,
        response: serializers.responseSerializer
    },
    browser: {
        serialize: ['event', 'request', 'response']
    }
}, multistream(streams));

log.requestLogger = function
createRequestLogger() {

    return function requestLogger(req, res,
        next) {

        // Used to calculate response times:
        var startTime = new Date();

        // Add a unique identifier to the request.
        req.requestId = uuidv4();
        // Log the request
        log.info({ request: req });

        // Make sure responses get logged, too:
        res.on('finish', function() {
            res.responseTime = new Date() - startTime;
            res.requestId = req.requestId;
            log.info({ response: res });
        });

        next();
    };
};

module.exports = {
    log: log
};