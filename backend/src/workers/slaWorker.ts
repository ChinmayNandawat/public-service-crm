import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { slaQueue } from './slaQueue';

// Temporary in-memory storage (same as in complaintController)
const complaints: any[] = [];

export interface SLAJobData {
  complaintId: number;
  originalPriority: number;
  escalationCount: number;
}

// Define department SLA mapping
const departmentSLA: Record<number, number> = {
  1: 24, // Water Supply
  2: 48, // Road Damage
  3: 12, // Sanitation
  4: 8,  // Electricity
};

// SLA Worker for monitoring complaint resolution times
export const slaWorker = new Worker<SLAJobData>(
  'slaQueue',
  async (job: Job<SLAJobData>) => {
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
          await slaQueue.add('sla-check', {
            complaintId,
            originalPriority: newPriorityScore,
            escalationCount: escalationCount + 1,
          }, {
            delay: followUpDelay,
          });
        }
      } else {
        console.log(`SLA OK for complaint ${complaintId}: ${hoursSinceAssignment.toFixed(2)}h <= ${slaHours}h`);
      }

    } catch (error) {
      console.error(`Error processing SLA job for complaint ${complaintId}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 SLA checks concurrently
  }
);

export default slaWorker;
