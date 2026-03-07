import { Queue } from 'bullmq';
export interface SLAJobData {
    complaintId: number;
    originalPriority: number;
    escalationCount: number;
}
export declare const slaQueue: Queue<SLAJobData, any, string, SLAJobData, any, string>;
export default slaQueue;
//# sourceMappingURL=slaQueue.d.ts.map