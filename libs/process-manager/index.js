const { fork } = require("child_process");
const batchJobs = require('./f3-job-batcher');
const logger = (require('./f3-logger')).initiateLog('pino');
const forked = [];
const maxCores = require('os').cpus().length;
const availableOperations = ["ITEM_EXPORT"];
const errHandlingProcess = "UNRESOLVED";
let occupiedCores = 0;

/**
 * responsible for decrementing the occupiedCores var indicating the number of spawned threads
 */
const freeResource = () => {
    if (occupiedCores <= 0) {
        occupiedCores = 0;
    } else {
        occupiedCores--;
    }
}

const occupyResource = () => {
    if (occupiedCores < maxCores) {
        occupiedCores++;
    }
}

const isCoreAvailable = () => {
    return occupiedCores < maxCores;
}

/**
 * function processes response from child processes during normal execution.
 * @param {JOB to perform in JSON} msg 
 */
const childProcessMessageProcessor = msg => {
    logger.debug({
            operation: `message from childjob :: ${batchJobs[jobJson.job]}`,
            logDetails: { available_cores: occupiedCores, child_msg: msg }
        },
        'Process Manager >> Message from Child Job'
    );
};

/**
 * function processes response when child process CLOSES.
 * @param {JOB to perform in JSON} msg 
 */
const onChildProcessClose = msg => {
    logger.debug({
            operation: `closing :: ${batchJobs[jobJson.job]}`,
            logDetails: { available_cores: occupiedCores, exit_code: msg }
        },
        'Process Manager >> Closing Process'
    );
    freeResource();
};

/**
 * function processes response when child process CLOSES.
 * @param {JOB to perform in JSON} msg 
 */
const onChildProcessExit = msg => {
    logger.debug({
            operation: `exiting :: ${batchJobs[jobJson.job]}`,
            logDetails: { available_cores: occupiedCores, exit_code: msg }
        },
        'Process Manager >> Exiting Process'
    );
    freeResource();
};

/**
 * function processes response when child process DISCONNECTS.
 * @param {JOB to perform in JSON} msg 
 */
const onChildProcessDisconnect = () => {
    logger.debug({
            operation: `forking:: ${batchJobs[jobJson.job]}`,
            logDetails: { available_cores: occupiedCores, job_json: jobJson }
        },
        'Process Manager >> Forking Process'
    );
    freeResource();
};

/**
 * responsible for forking a new process based on current available cores
 * @param {JSON} jobJson 
 */
const forkJob = (jobJson) => {

    if (isCoreAvailable() && availableOperations.indexOf(jobJson.job) > -1) {
        logger.debug({
                operation: `forking:: ${batchJobs[jobJson.job]}`,
                logDetails: { available_cores: occupiedCores, job_json: jobJson }
            },
            'Process Manager >> Forking Process'
        );
        forked[index] = fork(batchJobs[jobJson.job]);
        occupyResource();
    } else {
        forked[index] = fork(errHandlingProcess);
        occupyResource();
    }

    forked[index].on("message", childProcessMessageProcessor);

    forked[index].on("close", onChildProcessClose);

    forked[index].on("exit", onChildProcessExit);

    forked[index].on("disconnect", onChildProcessDisconnect);

    forked[index].send(job_json);
};

module.exports = {
    forkJob
};