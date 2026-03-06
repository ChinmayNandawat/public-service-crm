import { computePriorityScore, PriorityScoreInput } from '../utils/priorityScore';

describe('Priority Score Utility', () => {
  describe('computePriorityScore', () => {
    it('should calculate correct score for high urgency, angry sentiment', () => {
      const input: PriorityScoreInput = {
        urgency: 'high',
        sentiment: 'angry',
        location: 'Main Street',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      
      // Expected: 1.0 (high) + 0.2 (angry) = 1.2, clamped to 1.0
      expect(score).toBe(1.0);
    });

    it('should calculate correct score for medium urgency, neutral sentiment', () => {
      const input: PriorityScoreInput = {
        urgency: 'medium',
        sentiment: 'neutral',
        location: 'Regular Street',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      
      // Expected: 0.6 (medium) + 0 (neutral) = 0.6
      expect(score).toBe(0.6);
    });

    it('should calculate correct score for low urgency, positive sentiment', () => {
      const input: PriorityScoreInput = {
        urgency: 'low',
        sentiment: 'positive',
        location: 'Happy Street',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      
      // Expected: 0.3 (low) + (-0.05) (positive) = 0.25
      expect(score).toBe(0.25);
    });

    it('should add location sensitivity for critical areas', () => {
      const input: PriorityScoreInput = {
        urgency: 'medium',
        sentiment: 'neutral',
        location: 'Near the hospital',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      
      // Expected: 0.6 (medium) + 0 (neutral) + 0.1 (hospital) = 0.7
      expect(score).toBe(0.7);
    });

    it('should add location sensitivity for school', () => {
      const input: PriorityScoreInput = {
        urgency: 'low',
        sentiment: 'neutral',
        location: 'School area',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      
      // Expected: 0.3 (low) + 0 (neutral) + 0.1 (school) = 0.4
      expect(score).toBe(0.4);
    });

    it('should add location sensitivity for market', () => {
      const input: PriorityScoreInput = {
        urgency: 'low',
        sentiment: 'neutral',
        location: 'Market place',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      
      // Expected: 0.3 (low) + 0 (neutral) + 0.1 (market) = 0.4
      expect(score).toBe(0.4);
    });

    it('should add recurrence factor', () => {
      const input: PriorityScoreInput = {
        urgency: 'medium',
        sentiment: 'neutral',
        location: 'Regular Street',
        recurrence: 5
      };

      const score = computePriorityScore(input);
      
      // Expected: 0.6 (medium) + 0 (neutral) + (5 * 0.05) = 0.85
      expect(score).toBe(0.85);
    });

    it('should clamp scores to 0..1 range', () => {
      // Test upper bound
      const highInput: PriorityScoreInput = {
        urgency: 'high',
        sentiment: 'angry',
        location: 'hospital emergency',
        recurrence: 10
      };

      const highScore = computePriorityScore(highInput);
      // Expected: 1.0 + 0.2 + 0.1 + 0.5 = 1.8, clamped to 1.0
      expect(highScore).toBe(1.0);

      // Test lower bound
      const lowInput: PriorityScoreInput = {
        urgency: 'low',
        sentiment: 'positive',
        location: 'Regular Street',
        recurrence: 0
      };

      const lowScore = computePriorityScore(lowInput);
      // Expected: 0.3 + (-0.05) = 0.25, no clamping needed
      expect(lowScore).toBe(0.25);
    });

    it('should handle empty location gracefully', () => {
      const input: PriorityScoreInput = {
        urgency: 'medium',
        sentiment: 'neutral',
        location: undefined,
        recurrence: 0
      };

      const score = computePriorityScore(input);
      expect(score).toBe(0.6);
    });

    it('should round to 2 decimal places', () => {
      const input: PriorityScoreInput = {
        urgency: 'high',
        sentiment: 'neutral',
        location: undefined,
        recurrence: 3
      };

      const score = computePriorityScore(input);
      // Expected: 1.0 + 0 + 0.15 = 1.15, clamped to 1.0, rounded to 1.0
      expect(score).toBe(1.0);
    });

    it('should handle case-insensitive location matching', () => {
      const input: PriorityScoreInput = {
        urgency: 'low',
        sentiment: 'neutral',
        location: 'HOSPITAL',
        recurrence: 0
      };

      const score = computePriorityScore(input);
      expect(score).toBe(0.4); // 0.3 + 0.1 for hospital
    });
  });
});
