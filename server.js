const libs = require('./libs');
const app = libs.express;
const log = libs.log;

app.use(log.requestLogger());

app.get('/', (req, res) => {
    log.debug({ operation: 'get /', logDetails: { a: 1, b: 2, c: 3 } }, 'call to get /');
    res.end('Hi there');
});

var server = app.listen(3003, function() {
    var host = server.address().address
    var port = server.address().port

    log.info("Example app listening at http://%s:%s", host, port);
})