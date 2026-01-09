/**
 * Logger Utility
 * Simple structured logging for the application
 */

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
};

function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        ...meta,
    };

    const output = JSON.stringify(logEntry);

    switch (level) {
        case LOG_LEVELS.ERROR:
            console.error(output);
            break;
        case LOG_LEVELS.WARN:
            console.warn(output);
            break;
        case LOG_LEVELS.INFO:
        case LOG_LEVELS.DEBUG:
        default:
            console.log(output);
            break;
    }
}

module.exports = {
    error: (message, meta) => log(LOG_LEVELS.ERROR, message, meta),
    warn: (message, meta) => log(LOG_LEVELS.WARN, message, meta),
    info: (message, meta) => log(LOG_LEVELS.INFO, message, meta),
    debug: (message, meta) => log(LOG_LEVELS.DEBUG, message, meta),
};
