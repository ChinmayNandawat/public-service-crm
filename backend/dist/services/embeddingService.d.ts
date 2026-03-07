export interface ComplaintEmbedding {
    complaintId: number;
    embedding: number[];
    text: string;
}
export declare const generateEmbedding: (text: string) => Promise<number[]>;
export declare const calculateCosineSimilarity: (embedding1: number[], embedding2: number[]) => number;
export declare const findSimilarComplaints: (newComplaintText: string, newComplaintEmbedding: number[], existingComplaints: ComplaintEmbedding[]) => Promise<{
    id: number;
    similarity: number;
    text: string;
}[]>;
//# sourceMappingURL=embeddingService.d.ts.map