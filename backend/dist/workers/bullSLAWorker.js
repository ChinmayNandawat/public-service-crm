"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slaQueue = exports.bullSLAWorker = void 0;
const bull_1 = __importDefault(require("bull"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});
// Create queue
const slaQueue = new bull_1.default('sla-queue', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    }
});
exports.slaQueue = slaQueue;
// SLA Worker using Bull
const bullSLAWorker = slaQueue.process(5, async (job) => {
    const { complaintId, originalPriority, escalationCount } = job.data;
    console.log(`Processing SLA check for complaint ${complaintId}`);
    // Simple SLA logic for testing
    const isSLABreached = Math.random() > 0.5; // Random for testing
    if (isSLABreached) {
        console.log(`SLA BREACHED for complaint ${complaintId} - escalating priority`);
        // In a real system, this would update the database
        console.log(`Priority increased from ${originalPriority} to ${Math.min(originalPriority + 0.2, 1.0)}`);
    }
    else {
        console.log(`SLA OK for complaint ${complaintId}`);
    }
});
exports.bullSLAWorker = bullSLAWorker;
console.log('Bull SLA Worker started');
//# sourceMappingURL=bullSLAWorker.js.map