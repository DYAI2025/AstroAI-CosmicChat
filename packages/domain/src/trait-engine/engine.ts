/**
 * Main TraitEngine class
 * Orchestrates quiz answer processing and profile updates
 *
 * This class is isomorphic - runs in both browser and Node.js
 */

import type {
  QuizAnswer,
  TraitScore,
  PsychologicalProfile,
  ProfileSnapshot,
  QuestionTraitMapping,
  CalculationConfig,
  CalculationResult,
} from './types';

import {
  calculateAnswerScore,
  aggregateTraitScores,
  mergeTraitScores,
  createAggregatedTraits,
  calculateCompleteness,
  DEFAULT_CALCULATION_CONFIG,
  clampScore,
} from './calculator';

/**
 * Registry interface for quiz trait mappings
 */
export interface QuizRegistry {
  getQuizMappings(quizId: string): QuestionTraitMapping[] | undefined;
  getAllTraitIds(): string[];
}

/**
 * Options for TraitEngine initialization
 */
export interface TraitEngineOptions {
  /** Quiz registry for trait mappings */
  registry: QuizRegistry;
  /** Calculation configuration */
  config?: Partial<CalculationConfig>;
}

/**
 * TraitEngine - Core engine for processing quiz answers and updating psychological profiles
 *
 * Usage:
 * ```typescript
 * const engine = new TraitEngine({ registry });
 * const scores = engine.processAnswers(answers);
 * const updatedProfile = engine.updateProfile(currentProfile, scores);
 * const snapshot = engine.getSnapshot(updatedProfile);
 * ```
 */
export class TraitEngine {
  private readonly registry: QuizRegistry;
  private readonly config: CalculationConfig;

  constructor(options: TraitEngineOptions) {
    this.registry = options.registry;
    this.config = {
      ...DEFAULT_CALCULATION_CONFIG,
      ...options.config,
    };
  }

  /**
   * Process quiz answers and calculate trait scores
   *
   * @param answers - Array of quiz answers to process
   * @returns Array of calculated trait scores
   */
  processAnswers(answers: QuizAnswer[]): TraitScore[] {
    if (answers.length === 0) {
      return [];
    }

    // Group answers by quiz
    const answersByQuiz = this.groupAnswersByQuiz(answers);
    const allScores: TraitScore[] = [];

    for (const [quizId, quizAnswers] of answersByQuiz.entries()) {
      const quizScores = this.processQuizAnswers(quizId, quizAnswers);
      allScores.push(...quizScores);
    }

    return allScores;
  }

  /**
   * Update a psychological profile with new trait scores
   *
   * @param current - Current profile state
   * @param scores - New trait scores to incorporate
   * @returns Updated profile
   */
  updateProfile(
    current: PsychologicalProfile,
    scores: TraitScore[]
  ): PsychologicalProfile {
    if (scores.length === 0) {
      return current;
    }

    // Create a new traits map (immutable update)
    const updatedTraits = new Map(current.traits);

    for (const score of scores) {
      const existingHistory = updatedTraits.get(score.traitId);
      const mergedHistory = mergeTraitScores(existingHistory, score, this.config);
      updatedTraits.set(score.traitId, mergedHistory);
    }

    return {
      ...current,
      traits: updatedTraits,
      updatedAt: Date.now(),
      version: current.version + 1,
    };
  }

  /**
   * Get an aggregated snapshot of all traits in a profile
   *
   * @param profile - The profile to snapshot
   * @returns Complete profile snapshot
   */
  getSnapshot(profile: PsychologicalProfile): ProfileSnapshot {
    const traits = createAggregatedTraits(profile.traits);
    const allTraitIds = this.registry.getAllTraitIds();

    // Calculate completeness based on how many traits have data
    const filledTraits = traits.filter(
      (t) => t.confidence >= this.config.minConfidenceThreshold
    ).length;

    const completeness = calculateCompleteness(
      filledTraits,
      allTraitIds.length,
      this.config.minConfidenceThreshold
    );

    // Collect all contributing quiz IDs
    const contributingQuizIds = new Set<string>();
    for (const traitHistory of profile.traits.values()) {
      for (const entry of traitHistory.history) {
        contributingQuizIds.add(entry.sourceQuizId);
      }
    }

    return {
      snapshotId: this.generateSnapshotId(),
      timestamp: Date.now(),
      traits,
      completeness,
      contributingQuizIds: Array.from(contributingQuizIds),
    };
  }

  /**
   * Create a new empty profile
   *
   * @param userId - User identifier
   * @param profileId - Optional profile identifier (auto-generated if not provided)
   * @returns New empty profile
   */
  createProfile(userId: string, profileId?: string): PsychologicalProfile {
    const now = Date.now();
    return {
      profileId: profileId ?? this.generateProfileId(),
      userId,
      traits: new Map(),
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
  }

  /**
   * Validate answers before processing
   *
   * @param answers - Answers to validate
   * @returns Validation result with any errors/warnings
   */
  validateAnswers(answers: QuizAnswer[]): CalculationResult<void> {
    const warnings: string[] = [];

    for (const answer of answers) {
      // Check if quiz exists in registry
      const mappings = this.registry.getQuizMappings(answer.quizId);
      if (!mappings) {
        return {
          success: false,
          error: `Unknown quiz ID: ${answer.quizId}`,
          warnings,
        };
      }

      // Check if question exists in quiz
      const questionMapping = mappings.find(
        (m) => m.questionId === answer.questionId
      );
      if (!questionMapping) {
        warnings.push(
          `Question ${answer.questionId} not found in quiz ${answer.quizId}`
        );
      }
    }

    return {
      success: true,
      warnings,
    };
  }

  /**
   * Get the current configuration
   */
  getConfig(): CalculationConfig {
    return { ...this.config };
  }

  // Private methods

  private groupAnswersByQuiz(answers: QuizAnswer[]): Map<string, QuizAnswer[]> {
    const grouped = new Map<string, QuizAnswer[]>();

    for (const answer of answers) {
      const existing = grouped.get(answer.quizId);
      if (existing) {
        existing.push(answer);
      } else {
        grouped.set(answer.quizId, [answer]);
      }
    }

    return grouped;
  }

  private processQuizAnswers(quizId: string, answers: QuizAnswer[]): TraitScore[] {
    const mappings = this.registry.getQuizMappings(quizId);
    if (!mappings) {
      return [];
    }

    // Collect all scores by trait
    const scoresByTrait = new Map<string, number[]>();

    for (const answer of answers) {
      const mapping = mappings.find((m) => m.questionId === answer.questionId);
      if (!mapping) continue;

      const result = calculateAnswerScore(answer, mapping);
      if (!result.success || !result.data) continue;

      // Add scores to trait collections
      for (const [traitId, score] of result.data.entries()) {
        const existing = scoresByTrait.get(traitId);
        if (existing) {
          existing.push(score);
        } else {
          scoresByTrait.set(traitId, [score]);
        }
      }
    }

    // Aggregate scores for each trait
    const aggregated = aggregateTraitScores(scoresByTrait, this.config);

    // Convert to TraitScore array with quiz metadata
    const scores: TraitScore[] = [];
    for (const [traitId, traitScore] of aggregated.entries()) {
      scores.push({
        ...traitScore,
        traitId,
        sourceQuizId: quizId,
        score: clampScore(traitScore.score),
      });
    }

    return scores;
  }

  private generateSnapshotId(): string {
    return `snap_${Date.now()}_${this.randomString(8)}`;
  }

  private generateProfileId(): string {
    return `prof_${Date.now()}_${this.randomString(8)}`;
  }

  /**
   * Generate a random alphanumeric string
   * Isomorphic implementation that works in both browser and Node.js
   */
  private randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
