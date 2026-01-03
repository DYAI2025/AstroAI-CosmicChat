/**
 * Trait Engine - Core module for psychological trait processing
 * @module @quizzme/domain/trait-engine
 */

// Main engine class
export { TraitEngine } from './engine';
export type { QuizRegistry, TraitEngineOptions } from './engine';

// Calculator utilities
export {
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
} from './calculator';

// Types
export type {
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
} from './types';
