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

export const computePriorityScore = (input: PriorityScoreInput): number => {
  const { urgency, sentiment, location, recurrence = 0 } = input;

  // Urgency weight mapping
  const urgencyWeights = {
    high: 1.0,
    medium: 0.6,
    low: 0.3
  };

  // Sentiment boost mapping
  const sentimentBoosts = {
    angry: 0.2,
    neutral: 0,
    positive: -0.05
  };

  // Location sensitivity for critical areas
  const criticalAreas = ['hospital', 'school', 'market', 'government', 'emergency'];
  const locationSensitivity = location && criticalAreas.some(area => 
    location.toLowerCase().includes(area.toLowerCase())
  ) ? 0.1 : 0;

  // Calculate base score
  let score = urgencyWeights[urgency] + sentimentBoosts[sentiment] + locationSensitivity + (recurrence * 0.05);

  // Normalize and clamp to 0..1 range
  score = Math.max(0, Math.min(1, score));

  // Round to 2 decimal places
  return Math.round(score * 100) / 100;
};
