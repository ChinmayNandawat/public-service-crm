export declare const incrementComplaintsCreated: () => void;
export declare const incrementComplaintsResolved: (resolutionTimeSeconds: number) => void;
export declare const setActiveSLAJobs: (count: number) => void;
export declare const incrementTotalRequests: () => void;
export declare const incrementErrorRate: () => void;
export declare const getMetrics: () => {
    totalComplaints: number;
    resolvedComplaints: number;
    activeSLAJobs: number;
    averageResolutionTime: number;
    totalRequests: number;
    errorRate: number;
};
export declare const getPrometheusMetrics: () => Promise<string>;
//# sourceMappingURL=monitoringService.d.ts.map