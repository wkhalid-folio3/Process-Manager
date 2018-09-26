const logger = (require('../../../f3-logger')).initiateLog('pino');

process.on("message", msg => {
    logger.debug({
            operation: `processing message from parent`,
            logDetails: { parent_msg: msg }
        },
        'Process Manager >> ITEM_EXPORT PROCESS'
    );
});

process.send({ job: 'ITEM_EXPORT', status: 'in middle of execution' });
let i = 0;

while (i < 8000) {
    i++;
}

i = 0;
while (i < 8000) {
    i++;
}

i = 0;
while (i < 8000) {
    i++;
}

i = 0;
while (i < 8000) {
    i++;
}

process.exit();