import { ClassificationResult } from '../utils/priorityScore';
export declare class AIService {
    /**
     * Classifies text using AI/LLM or returns default classification
     * In a real implementation, this would call an actual AI service
     */
    static classify(text: string): Promise<ClassificationResult>;
    /**
     * Future method for actual LLM integration
     */
    static classifyWithLLM(text: string): Promise<ClassificationResult>;
}
//# sourceMappingURL=aiService.d.ts.map