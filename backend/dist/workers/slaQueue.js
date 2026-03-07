"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slaQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
// Create SLA monitoring queue
exports.slaQueue = new bullmq_1.Queue('slaQueue', {
    connection: redis_1.redisConnection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    },
});
exports.default = exports.slaQueue;
//# sourceMappingURL=slaQueue.js.map