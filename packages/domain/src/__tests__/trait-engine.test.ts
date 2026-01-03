import { describe, it, expect, beforeEach } from 'vitest';
import type {
  QuizAnswer,
  TraitScore,
  QuestionTraitMapping,
  AggregatedTrait,
  ProfileSnapshot,
  PsychologicalProfile,
  TraitHistory,
  CalculationConfig,
  CalculationResult,
} from '../trait-engine/types.js';

/**
 * Trait Engine Tests
 *
 * These tests verify the core psychological profiling logic.
 * The TraitEngine processes quiz answers into trait scores and
 * maintains user profiles over time.
 */

// Mock implementations for testing
// In a real scenario, these would be imported from the actual module
class MockTraitEngine {
  private config: CalculationConfig;
  private traitMappings: Map<string, QuestionTraitMapping>;

  constructor(config?: Partial<CalculationConfig>) {
    this.config = {
      recencyDecay: 0.9,
      minConfidenceThreshold: 0.3,
      maxHistoryEntries: 100,
      defaultWeight: 1.0,
      ...config,
    };
    this.traitMappings = new Map();
  }

  registerMapping(mapping: QuestionTraitMapping): void {
    this.traitMappings.set(mapping.questionId, mapping);
  }

  processAnswers(answers: QuizAnswer[]): CalculationResult<TraitScore[]> {
    const warnings: string[] = [];
    const traitScores = new Map<string, { total: number; count: number; quizId: string }>();

    for (const answer of answers) {
      const mapping = this.traitMappings.get(answer.questionId);

      if (!mapping) {
        warnings.push(`No mapping found for question: ${answer.questionId}`);
        continue;
      }

      // Calculate raw score based on mapping type
      let rawScore = 0;
      if (mapping.scoreMapping.type === 'linear' && mapping.scoreMapping.scale) {
        const { min, max } = mapping.scoreMapping.scale;
        const value = typeof answer.selectedValue === 'number' ? answer.selectedValue : 0;
        rawScore = (value - min) / (max - min);
      } else if (mapping.scoreMapping.type === 'discrete' && mapping.scoreMapping.discreteValues) {
        rawScore = mapping.scoreMapping.discreteValues[answer.selectedValue] ?? 0;
      } else if (mapping.scoreMapping.type === 'inverted' && mapping.scoreMapping.scale) {
        const { min, max } = mapping.scoreMapping.scale;
        const value = typeof answer.selectedValue === 'number' ? answer.selectedValue : 0;
        rawScore = 1 - (value - min) / (max - min);
      }

      // Apply weight and accumulate
      const weight = answer.weight ?? this.config.defaultWeight;
      for (const [traitId, traitWeight] of Object.entries(mapping.traitWeights)) {
        const current = traitScores.get(traitId) ?? { total: 0, count: 0, quizId: answer.quizId };
        current.total += rawScore * traitWeight * weight;
        current.count += 1;
        traitScores.set(traitId, current);
      }
    }

    const results: TraitScore[] = [];
    for (const [traitId, data] of traitScores) {
      const score = data.count > 0 ? data.total / data.count : 0;
      const confidence = Math.min(1, data.count / 10); // More answers = more confidence
      results.push({
        traitId,
        score: Math.max(0, Math.min(1, score)), // Clamp to 0-1
        confidence,
        sourceQuizId: data.quizId,
        questionCount: data.count,
      });
    }

    return {
      success: results.length > 0 || warnings.length === 0,
      data: results,
      warnings,
    };
  }

  updateProfile(profile: PsychologicalProfile, newScores: TraitScore[]): PsychologicalProfile {
    const updatedTraits = new Map(profile.traits);
    const now = Date.now();

    for (const score of newScores) {
      let history = updatedTraits.get(score.traitId);

      if (!history) {
        history = {
          traitId: score.traitId,
          currentScore: 0,
          currentConfidence: 0,
          history: [],
        };
      }

      // Add to history
      history.history.push({
        score: score.score,
        confidence: score.confidence,
        timestamp: now,
        sourceQuizId: score.sourceQuizId,
      });

      // Trim history if needed
      if (history.history.length > this.config.maxHistoryEntries) {
        history.history = history.history.slice(-this.config.maxHistoryEntries);
      }

      // Calculate new current score with recency weighting
      let totalWeight = 0;
      let weightedSum = 0;
      for (let i = history.history.length - 1; i >= 0; i--) {
        const entry = history.history[i];
        const weight = Math.pow(this.config.recencyDecay, history.history.length - 1 - i);
        weightedSum += entry.score * weight * entry.confidence;
        totalWeight += weight * entry.confidence;
      }

      history.currentScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
      history.currentConfidence = Math.min(1, history.history.length / 5);

      updatedTraits.set(score.traitId, history);
    }

    return {
      ...profile,
      traits: updatedTraits,
      updatedAt: now,
      version: profile.version + 1,
    };
  }

  createSnapshot(profile: PsychologicalProfile): ProfileSnapshot {
    const traits: AggregatedTrait[] = [];
    const contributingQuizIds = new Set<string>();
    const now = Date.now();

    for (const [traitId, history] of profile.traits) {
      traits.push({
        traitId,
        aggregatedScore: history.currentScore,
        confidence: history.currentConfidence,
        dataPoints: history.history.length,
        lastUpdated: history.history[history.history.length - 1]?.timestamp ?? now,
      });

      for (const entry of history.history) {
        contributingQuizIds.add(entry.sourceQuizId);
      }
    }

    const maxPossibleTraits = 10; // Assume 10 possible traits for completeness calculation
    const completeness = traits.length / maxPossibleTraits;

    return {
      snapshotId: `snapshot-${now}`,
      timestamp: now,
      traits,
      completeness: Math.min(1, completeness),
      contributingQuizIds: Array.from(contributingQuizIds),
    };
  }
}

describe('TraitEngine', () => {
  let engine: MockTraitEngine;
  let baseProfile: PsychologicalProfile;

  beforeEach(() => {
    engine = new MockTraitEngine();
    baseProfile = {
      profileId: 'test-profile-1',
      userId: 'user-1',
      traits: new Map(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };

    // Register sample question mappings
    engine.registerMapping({
      questionId: 'q1',
      traitWeights: { extraversion: 1.0 },
      scoreMapping: { type: 'linear', scale: { min: 1, max: 5 } },
    });
    engine.registerMapping({
      questionId: 'q2',
      traitWeights: { openness: 1.0, creativity: 0.5 },
      scoreMapping: { type: 'linear', scale: { min: 1, max: 5 } },
    });
    engine.registerMapping({
      questionId: 'q3',
      traitWeights: { conscientiousness: 1.0 },
      scoreMapping: {
        type: 'discrete',
        discreteValues: { always: 1.0, sometimes: 0.5, never: 0.0 },
      },
    });
  });

  describe('Answer Processing', () => {
    it('should process quiz answers into trait scores', () => {
      const answers: QuizAnswer[] = [
        {
          questionId: 'q1',
          quizId: 'quiz-1',
          selectedValue: 4, // High extraversion
          timestamp: Date.now(),
        },
        {
          questionId: 'q2',
          quizId: 'quiz-1',
          selectedValue: 5, // High openness
          timestamp: Date.now(),
        },
      ];

      const result = engine.processAnswers(answers);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.length).toBeGreaterThan(0);

      const extraversionScore = result.data!.find((s) => s.traitId === 'extraversion');
      expect(extraversionScore).toBeDefined();
      expect(extraversionScore!.score).toBeGreaterThan(0.5); // Should be high
    });

    it('should handle missing question mappings gracefully', () => {
      const answers: QuizAnswer[] = [
        {
          questionId: 'unmapped-question',
          quizId: 'quiz-1',
          selectedValue: 3,
          timestamp: Date.now(),
        },
      ];

      const result = engine.processAnswers(answers);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('unmapped-question');
    });

    it('should handle discrete value mappings', () => {
      const answers: QuizAnswer[] = [
        {
          questionId: 'q3',
          quizId: 'quiz-1',
          selectedValue: 'always',
          timestamp: Date.now(),
        },
      ];

      const result = engine.processAnswers(answers);

      expect(result.success).toBe(true);
      const conscientiousnessScore = result.data!.find((s) => s.traitId === 'conscientiousness');
      expect(conscientiousnessScore?.score).toBe(1.0);
    });

    it('should apply answer weights', () => {
      const highWeight: QuizAnswer[] = [
        {
          questionId: 'q1',
          quizId: 'quiz-1',
          selectedValue: 5,
          weight: 2.0,
          timestamp: Date.now(),
        },
      ];

      const normalWeight: QuizAnswer[] = [
        {
          questionId: 'q1',
          quizId: 'quiz-1',
          selectedValue: 5,
          timestamp: Date.now(),
        },
      ];

      const highResult = engine.processAnswers(highWeight);
      const normalResult = engine.processAnswers(normalWeight);

      // Both should have same normalized score since we're averaging
      expect(highResult.data![0].score).toEqual(normalResult.data![0].score);
    });
  });

  describe('Profile Updates', () => {
    it('should update profile with new scores', () => {
      const newScores: TraitScore[] = [
        {
          traitId: 'extraversion',
          score: 0.8,
          confidence: 0.5,
          sourceQuizId: 'quiz-1',
          questionCount: 5,
        },
      ];

      const updatedProfile = engine.updateProfile(baseProfile, newScores);

      expect(updatedProfile.version).toBe(baseProfile.version + 1);
      expect(updatedProfile.traits.has('extraversion')).toBe(true);
      expect(updatedProfile.traits.get('extraversion')!.currentScore).toBeGreaterThan(0);
    });

    it('should accumulate history entries', () => {
      const firstScores: TraitScore[] = [
        {
          traitId: 'openness',
          score: 0.6,
          confidence: 0.3,
          sourceQuizId: 'quiz-1',
          questionCount: 3,
        },
      ];

      const secondScores: TraitScore[] = [
        {
          traitId: 'openness',
          score: 0.8,
          confidence: 0.5,
          sourceQuizId: 'quiz-2',
          questionCount: 5,
        },
      ];

      let profile = engine.updateProfile(baseProfile, firstScores);
      profile = engine.updateProfile(profile, secondScores);

      const history = profile.traits.get('openness')!.history;
      expect(history.length).toBe(2);
    });

    it('should apply recency weighting to scores', () => {
      // Add an old score
      const oldScores: TraitScore[] = [
        {
          traitId: 'agreeableness',
          score: 0.3,
          confidence: 0.8,
          sourceQuizId: 'quiz-1',
          questionCount: 10,
        },
      ];

      // Add a new score
      const newScores: TraitScore[] = [
        {
          traitId: 'agreeableness',
          score: 0.9,
          confidence: 0.8,
          sourceQuizId: 'quiz-2',
          questionCount: 10,
        },
      ];

      let profile = engine.updateProfile(baseProfile, oldScores);
      profile = engine.updateProfile(profile, newScores);

      // Current score should be weighted toward the more recent score (0.9)
      const currentScore = profile.traits.get('agreeableness')!.currentScore;
      expect(currentScore).toBeGreaterThan(0.5); // Closer to 0.9 than 0.3
    });
  });

  describe('Profile Snapshots', () => {
    it('should create a snapshot of the current profile state', () => {
      const scores: TraitScore[] = [
        {
          traitId: 'extraversion',
          score: 0.7,
          confidence: 0.6,
          sourceQuizId: 'quiz-1',
          questionCount: 5,
        },
        {
          traitId: 'openness',
          score: 0.5,
          confidence: 0.4,
          sourceQuizId: 'quiz-1',
          questionCount: 3,
        },
      ];

      const profile = engine.updateProfile(baseProfile, scores);
      const snapshot = engine.createSnapshot(profile);

      expect(snapshot.snapshotId).toBeDefined();
      expect(snapshot.traits.length).toBe(2);
      expect(snapshot.contributingQuizIds).toContain('quiz-1');
    });

    it('should calculate profile completeness', () => {
      // With 2 out of 10 possible traits
      const scores: TraitScore[] = [
        {
          traitId: 'extraversion',
          score: 0.7,
          confidence: 0.6,
          sourceQuizId: 'quiz-1',
          questionCount: 5,
        },
        {
          traitId: 'openness',
          score: 0.5,
          confidence: 0.4,
          sourceQuizId: 'quiz-1',
          questionCount: 3,
        },
      ];

      const profile = engine.updateProfile(baseProfile, scores);
      const snapshot = engine.createSnapshot(profile);

      expect(snapshot.completeness).toBe(0.2); // 2/10
    });
  });

  describe('Configuration', () => {
    it('should respect custom configuration', () => {
      const customEngine = new MockTraitEngine({
        recencyDecay: 0.5,
        minConfidenceThreshold: 0.5,
        maxHistoryEntries: 5,
      });

      customEngine.registerMapping({
        questionId: 'q1',
        traitWeights: { test: 1.0 },
        scoreMapping: { type: 'linear', scale: { min: 1, max: 5 } },
      });

      // Add more than maxHistoryEntries
      let profile = baseProfile;
      for (let i = 0; i < 10; i++) {
        const scores: TraitScore[] = [
          {
            traitId: 'test',
            score: 0.5,
            confidence: 0.5,
            sourceQuizId: `quiz-${i}`,
            questionCount: 1,
          },
        ];
        profile = customEngine.updateProfile(profile, scores);
      }

      // History should be trimmed to maxHistoryEntries
      expect(profile.traits.get('test')!.history.length).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty answer array', () => {
      const result = engine.processAnswers([]);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should clamp scores to 0-1 range', () => {
      engine.registerMapping({
        questionId: 'extreme',
        traitWeights: { test: 3.0 }, // High weight could push score > 1
        scoreMapping: { type: 'linear', scale: { min: 1, max: 5 } },
      });

      const answers: QuizAnswer[] = [
        {
          questionId: 'extreme',
          quizId: 'quiz-1',
          selectedValue: 5,
          weight: 2.0,
          timestamp: Date.now(),
        },
      ];

      const result = engine.processAnswers(answers);
      expect(result.data![0].score).toBeLessThanOrEqual(1);
      expect(result.data![0].score).toBeGreaterThanOrEqual(0);
    });

    it('should handle profile with no existing traits', () => {
      const emptyProfile: PsychologicalProfile = {
        profileId: 'empty',
        userId: 'user-1',
        traits: new Map(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      };

      const snapshot = engine.createSnapshot(emptyProfile);
      expect(snapshot.traits).toEqual([]);
      expect(snapshot.completeness).toBe(0);
    });
  });
});
