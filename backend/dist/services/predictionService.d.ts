interface PredictionInput {
    periodDays?: number;
    groupBy?: 'ward' | 'department';
}
interface HistoricalData {
    date: string;
    count: number;
}
interface PredictionResult {
    wardId?: number;
    wardName?: string;
    departmentId?: number;
    departmentName?: string;
    predictedComplaints: number;
    confidence: number;
    risk: 'low' | 'medium' | 'high';
    historicalAverage: number;
    trend: number;
}
interface ComplaintData {
    id: number;
    createdAt: string;
    wardId?: number;
    departmentId?: number;
}
export declare function predictComplaints(complaints: ComplaintData[], options?: PredictionInput): Promise<PredictionResult[]>;
export declare function createSampleTimeSeries(): HistoricalData[];
export {};
//# sourceMappingURL=predictionService.d.ts.map