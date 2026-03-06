import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export interface SLAJobData {
  complaintId: number;
  originalPriority: number;
  escalationCount: number;
}

// Create SLA monitoring queue
export const slaQueue = new Queue<SLAJobData>('slaQueue', {
  connection: redisConnection,
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

export default slaQueue;
