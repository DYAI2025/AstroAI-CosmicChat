/**
 * @quizzme/domain
 * Domain logic and Trait Engine for QuizzMe psychological profiling
 *
 * This package is isomorphic - it runs in both browser and Node.js environments.
 *
 * @example
 * ```typescript
 * import { TraitEngine, InMemoryQuizRegistry } from '@quizzme/domain';
 *
 * // Create a registry and register quizzes
 * const registry = new InMemoryQuizRegistry();
 * registry.registerQuiz(myQuizDefinition);
 *
 * // Create the engine
 * const engine = new TraitEngine({ registry });
 *
 * // Process quiz answers
 * const scores = engine.processAnswers(answers);
 *
 * // Update profile with new scores
 * const profile = engine.createProfile('user-123');
 * const updatedProfile = engine.updateProfile(profile, scores);
 *
 * // Get a snapshot of the profile
 * const snapshot = engine.getSnapshot(updatedProfile);
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// Trait Engine
// ============================================================================

export {
  // Main engine class
  TraitEngine,

  // Calculator utilities
  normalizeScore,
  calculateAnswerScore,
  aggregateTraitScores,
  calculateConfidence,
  mergeTraitScores,
  createAggregatedTraits,
  calculateCompleteness,
  isValidScore,
  clampScore,
  DEFAULT_CALCULATION_CONFIG,
} from './trait-engine';

export type {
  // Engine types
  QuizRegistry,
  TraitEngineOptions,

  // Core types
  QuizAnswer,
  TraitScore,
  QuestionTraitMapping,
  AnswerScoreMapping,
  AggregatedTrait,
  ProfileSnapshot,
  PsychologicalProfile,
  TraitHistory,
  TraitHistoryEntry,
  CalculationConfig,
  CalculationResult,
} from './trait-engine';

// ============================================================================
// Profile Management
// ============================================================================

export {
  // State management
  serializeProfile,
  deserializeProfile,
  cloneProfile,
  profilesEqual,
  mergeProfiles,
  getTraitScore,
  getTraitConfidence,
  hasTraitData,
  getPopulatedTraitIds,
  getTraitAge,
  pruneProfileHistory,

  // Quiz Registry
  InMemoryQuizRegistry,
  createLinearMapping,
  createInvertedMapping,
  createDiscreteMapping,
  createLikertMapping,
  defineQuiz,
  defineTrait,

  // Predefined traits and quizzes
  BIG_FIVE_TRAITS,
  TRAIT_OPENNESS,
  TRAIT_CONSCIENTIOUSNESS,
  TRAIT_EXTRAVERSION,
  TRAIT_AGREEABLENESS,
  TRAIT_NEUROTICISM,
  PERSONALITY_QUIZ,
  ALL_TRAITS,
  ALL_QUIZZES,
  initializeRegistry,
} from './profile';

export type {
  // Serialization types
  SerializedProfile,
  SerializedTraitHistory,

  // Registry types
  QuizDefinition,
  QuizCategory,
  QuestionDefinition,
  AnswerOption,
  TraitDefinition,
  RegistryStats,
} from './profile';
