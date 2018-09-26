const logger = (require('../f3-logger')).initiateLog('pino');


let spawnedJobs = [
    './libs/process-manager/processes/executers/item-export.js',
    './libs/process-manager/processes/executers/unresolved-job.js'
];

const processMessageParser = {
    ITEM_EXPORT: (msg) => {
        logger.debug({
                operation: `processing message for item export`,
                logDetails: { child_message: msg }
            },
            'Process Manager >> RESPONSE FROM ITEM_EXPORT'
        );
    },

    UNRESOLVED: (msg) => {
        logger.debug({
                operation: `message from unresolved job`,
                logDetails: { child_message: msg }
            },
            'Process Manager >> RESPONSE FROM UNRESOLVED JOB'
        );
    }
}

module.exports = {
    "EXECUTERS": {
        "ITEM_EXPORT": spawnedJobs[0],
        "UNRESOLVED": spawnedJobs[spawnedJobs.length - 1]
    },
    "RESPONSE_MANAGERS": {
        "ITEM_EXPORT": processMessageParser.ITEM_EXPORT,
        "UNRESOLVED": processMessageParser.UNRESOLVED
    }
};