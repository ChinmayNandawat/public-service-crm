import Bull from 'bull';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Create queue
const slaQueue = new Bull('sla-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

export interface SLAJobData {
  complaintId: number;
  originalPriority: number;
  escalationCount: number;
}

// SLA Worker using Bull
const bullSLAWorker = slaQueue.process(5, async (job: any) => {
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
});

console.log('Bull SLA Worker started');

export { bullSLAWorker, slaQueue };
