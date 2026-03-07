import Bull from 'bull';
declare const slaQueue: Bull.Queue<any>;
export interface SLAJobData {
    complaintId: number;
    originalPriority: number;
    escalationCount: number;
}
declare const bullSLAWorker: Promise<void>;
export { bullSLAWorker, slaQueue };
//# sourceMappingURL=bullSLAWorker.d.ts.map