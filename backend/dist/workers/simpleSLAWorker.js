"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const simpleSLAWorker = new bullmq_1.Worker('sla-queue', async (job) => {
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
}, {
    connection: redis_1.redisConnection,
    concurrency: 5,
});
console.log('Simple SLA Worker started');
exports.default = simpleSLAWorker;
//# sourceMappingURL=simpleSLAWorker.js.map