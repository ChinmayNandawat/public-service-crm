"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Simple logger implementation
exports.default = {
    info: (message, meta) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: 'info',
            message,
            ...meta
        };
        console.log(JSON.stringify(logEntry));
    },
    warn: (message, meta) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: 'warn',
            message,
            ...meta
        };
        console.warn(JSON.stringify(logEntry));
    },
    error: (message, meta) => {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: 'error',
            message,
            ...meta
        };
        console.error(JSON.stringify(logEntry));
    }
};
//# sourceMappingURL=logger.js.map