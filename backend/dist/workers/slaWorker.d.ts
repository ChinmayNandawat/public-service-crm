import { Worker } from 'bullmq';
export interface SLAJobData {
    complaintId: number;
    originalPriority: number;
    escalationCount: number;
}
export declare const slaWorker: Worker<SLAJobData, any, string>;
export default slaWorker;
//# sourceMappingURL=slaWorker.d.ts.map