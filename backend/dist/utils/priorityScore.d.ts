export interface ClassificationResult {
    category: string;
    urgency: 'high' | 'medium' | 'low';
    sentiment: 'angry' | 'neutral' | 'positive';
}
export interface PriorityScoreInput {
    urgency: 'high' | 'medium' | 'low';
    sentiment: 'angry' | 'neutral' | 'positive';
    location?: string;
    recurrence?: number;
}
export declare const computePriorityScore: (input: PriorityScoreInput) => number;
//# sourceMappingURL=priorityScore.d.ts.map