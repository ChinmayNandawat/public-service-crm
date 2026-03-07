"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slaWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const slaQueue_1 = require("./slaQueue");
// Temporary in-memory storage (same as in complaintController)
const complaints = [];
// Define department SLA mapping
const departmentSLA = {
    1: 24, // Water Supply
    2: 48, // Road Damage
    3: 12, // Sanitation
    4: 8, // Electricity
};
// SLA Worker for monitoring complaint resolution times
exports.slaWorker = new bullmq_1.Worker('slaQueue', async (job) => {
    const { complaintId, originalPriority, escalationCount } = job.data;
    try {
        console.log(`Processing SLA check for complaint ${complaintId}`);
        // Get current complaint details
        const complaint = complaints.find(c => c.id === complaintId);
        if (!complaint) {
            console.error(`Complaint ${complaintId} not found`);
            return;
        }
        // Check if complaint is still unresolved
        if (complaint.status === 'resolved' || complaint.status === 'closed') {
            console.log(`Complaint ${complaintId} is already resolved, skipping SLA check`);
            return;
        }
        // Calculate time since assignment
        const now = new Date();
        const assignedAt = complaint.assignedAt ? new Date(complaint.assignedAt) : now;
        const hoursSinceAssignment = (now.getTime() - assignedAt.getTime()) / (1000 * 60 * 60);
        // Get department SLA hours
        const slaHours = departmentSLA[complaint.departmentId || 1] || 24;
        // Check if SLA is breached
        const isSLABreached = hoursSinceAssignment > slaHours;
        if (isSLABreached) {
            console.log(`SLA BREACHED for complaint ${complaintId}: ${hoursSinceAssignment.toFixed(2)}h > ${slaHours}h`);
            // Escalate complaint by increasing priority
            const newPriorityScore = Math.min(originalPriority + 0.2, 1.0); // Increase by 0.2, max 1.0
            // Find and update complaint
            const complaintIndex = complaints.findIndex(c => c.id === complaintId);
            if (complaintIndex !== -1) {
                complaints[complaintIndex].priorityScore = newPriorityScore;
                complaints[complaintIndex].status = 'in_progress';
            }
            // Create escalation log entry (this would go to a separate escalation table in a real system)
            console.log(`ESCALATION: Complaint ${complaintId} escalated to priority ${newPriorityScore}`);
            // If this is the first escalation, create a follow-up job
            if (escalationCount === 0) {
                const followUpDelay = slaHours * 0.5 * 3600 * 1000; // Half of SLA time in milliseconds
                // Add a follow-up job to check again
                await slaQueue_1.slaQueue.add('sla-check', {
                    complaintId,
                    originalPriority: newPriorityScore,
                    escalationCount: escalationCount + 1,
                }, {
                    delay: followUpDelay,
                });
            }
        }
        else {
            console.log(`SLA OK for complaint ${complaintId}: ${hoursSinceAssignment.toFixed(2)}h <= ${slaHours}h`);
        }
    }
    catch (error) {
        console.error(`Error processing SLA job for complaint ${complaintId}:`, error);
        throw error;
    }
}, {
    connection: redis_1.redisConnection,
    concurrency: 5, // Process up to 5 SLA checks concurrently
});
exports.default = exports.slaWorker;
//# sourceMappingURL=slaWorker.js.map