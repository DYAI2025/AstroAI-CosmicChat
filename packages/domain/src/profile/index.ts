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

// Predefined traits and quizzes
export {
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
} from './predefined';
