const libs = require('./libs');
const app = libs.express;
const log = libs.log;
const forkJob = libs.forkJob;

app.get('/test', (req, res) => {
    log.debug({ operation: 'post /', logDetails: { a: 1, b: 2, c: 3 } }, 'call to get /');
    res.end('Hi there');
});

app.post('/submitJob', (req, res) => {
    log.debug({
            operation: 'post /',
            logDetails: { requestData: req.body }
        },
        'call to post /'
    );
    let processStatus = forkJob(req.body);
    res.end('child process response: ' + JSON.stringify(processStatus));
});

var server = app.listen(3003, function() {
    var host = server.address().address
    var port = server.address().port

    log.info("Example app listening at http://%s:%s", host, port);
})