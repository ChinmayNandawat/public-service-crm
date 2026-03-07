interface AnalyticsSnapshot {
    totalComplaints: number;
    resolvedComplaints: number;
    avgResolutionTime: number;
    topWards: {
        id: number;
        name: string;
        count: number;
    }[];
    topDepartments: {
        id: number;
        name: string;
        count: number;
    }[];
    recentComplaints: Array<{
        id: number;
        description: string;
        status: string;
        wardId: number;
        departmentId: number;
        createdAt: string;
    }>;
    escalationTrend: number;
}
interface CopilotResponse {
    analysis: string;
    recommendations: string[];
    citations: string[];
    source: 'llm' | 'fallback';
}
export declare function analyzeMunicipalData(question: string, context: AnalyticsSnapshot, adminId?: string): Promise<CopilotResponse>;
export {};
//# sourceMappingURL=copilotService.d.ts.map