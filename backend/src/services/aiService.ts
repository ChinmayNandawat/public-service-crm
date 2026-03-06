import { ClassificationResult } from '../utils/priorityScore';

export class AIService {
  /**
   * Classifies text using AI/LLM or returns default classification
   * In a real implementation, this would call an actual AI service
   */
  static async classify(text: string): Promise<ClassificationResult> {
    // TODO: Replace with actual LLM integration
    // For now, return default classification based on simple keyword matching
    
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based classification as fallback
    let category = 'General';
    let urgency: 'high' | 'medium' | 'low' = 'low';
    let sentiment: 'angry' | 'neutral' | 'positive' = 'neutral';

    // Category detection
    if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('pipe')) {
      category = 'Water Supply';
    } else if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('street')) {
      category = 'Road Damage';
    } else if (lowerText.includes('garbage') || lowerText.includes('trash') || lowerText.includes('waste')) {
      category = 'Sanitation';
    } else if (lowerText.includes('electricity') || lowerText.includes('power') || lowerText.includes('outage')) {
      category = 'Electricity';
    }

    // Urgency detection
    const urgentWords = ['emergency', 'urgent', 'critical', 'danger', 'immediate', 'severe'];
    const mediumWords = ['soon', 'please', 'need', 'issue', 'problem'];
    
    if (urgentWords.some(word => lowerText.includes(word))) {
      urgency = 'high';
    } else if (mediumWords.some(word => lowerText.includes(word))) {
      urgency = 'medium';
    }

    // Sentiment detection
    const angryWords = ['angry', 'frustrated', 'terrible', 'awful', 'disgusted', 'furious'];
    const positiveWords = ['thank', 'good', 'great', 'appreciate', 'wonderful'];
    
    if (angryWords.some(word => lowerText.includes(word))) {
      sentiment = 'angry';
    } else if (positiveWords.some(word => lowerText.includes(word))) {
      sentiment = 'positive';
    }

    return {
      category,
      urgency,
      sentiment
    };
  }

  /**
   * Future method for actual LLM integration
   */
  static async classifyWithLLM(text: string): Promise<ClassificationResult> {
    // TODO: Implement actual LLM call
    // This would integrate with OpenAI, Claude, or other AI services
    throw new Error('LLM integration not implemented yet');
  }
}
