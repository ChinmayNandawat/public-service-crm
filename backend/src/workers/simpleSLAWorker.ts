import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

const simpleSLAWorker = new Worker(
  'sla-queue',
  async (job) => {
    const { complaintId, originalPriority, escalationCount } = job.data;
    
    console.log(`Processing SLA check for complaint ${complaintId}`);
    
    // Simple SLA logic for testing
    const isSLABreached = Math.random() > 0.5; // Random for testing
    
    if (isSLABreached) {
      console.log(`SLA BREACHED for complaint ${complaintId} - escalating priority`);
      
      // In a real system, this would update the database
      console.log(`Priority increased from ${originalPriority} to ${Math.min(originalPriority + 0.2, 1.0)}`);
    } else {
      console.log(`SLA OK for complaint ${complaintId}`);
    }
  },
  {
    connection: redisConnection,
  concurrency: 5,
  }
);

console.log('Simple SLA Worker started');

export default simpleSLAWorker;
