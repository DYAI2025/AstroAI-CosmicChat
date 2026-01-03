/**
 * Profile module - State management and quiz registry
 * @module @quizzme/domain/profile
 */

// State management
export {
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
} from './state';

export type {
  SerializedProfile,
  SerializedTraitHistory,
} from './state';

// Quiz Registry
export {
  InMemoryQuizRegistry,
  createLinearMapping,
  createInvertedMapping,
  createDiscreteMapping,
  createLikertMapping,
  defineQuiz,
  defineTrait,
} from './registry';

export type {
  QuizDefinition,
  QuizCategory,
  QuestionDefinition,
  AnswerOption,
  TraitDefinition,
  RegistryStats,
} from './registry';
