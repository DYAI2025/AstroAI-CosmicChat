/**
 * Predefined Traits and Quizzes
 * Contains the Big Five personality traits and starter quizzes
 */

import type { TraitDefinition, QuizDefinition, QuestionDefinition } from './registry';
import { createLikertMapping, createInvertedMapping } from './registry';

// =============================================================================
// TRAIT DEFINITIONS - Big Five Personality Model
// =============================================================================

export const TRAIT_OPENNESS: TraitDefinition = {
  traitId: 'openness',
  name: 'Offenheit',
  description: 'Offenheit für neue Erfahrungen, Kreativität und intellektuelle Neugier',
  category: 'personality',
  lowLabel: 'Konventionell',
  highLabel: 'Kreativ',
};

export const TRAIT_CONSCIENTIOUSNESS: TraitDefinition = {
  traitId: 'conscientiousness',
  name: 'Gewissenhaftigkeit',
  description: 'Selbstdisziplin, Zuverlässigkeit und Zielorientierung',
  category: 'personality',
  lowLabel: 'Flexibel',
  highLabel: 'Strukturiert',
};

export const TRAIT_EXTRAVERSION: TraitDefinition = {
  traitId: 'extraversion',
  name: 'Extraversion',
  description: 'Geselligkeit, Energie und positive Emotionen',
  category: 'personality',
  lowLabel: 'Introvertiert',
  highLabel: 'Extravertiert',
};

export const TRAIT_AGREEABLENESS: TraitDefinition = {
  traitId: 'agreeableness',
  name: 'Verträglichkeit',
  description: 'Mitgefühl, Kooperation und soziale Harmonie',
  category: 'personality',
  lowLabel: 'Wettbewerbsorientiert',
  highLabel: 'Kooperativ',
};

export const TRAIT_NEUROTICISM: TraitDefinition = {
  traitId: 'neuroticism',
  name: 'Emotionale Stabilität',
  description: 'Emotionale Ausgeglichenheit und Stressresistenz',
  category: 'personality',
  lowLabel: 'Stabil',
  highLabel: 'Sensibel',
};

/**
 * All Big Five traits
 */
export const BIG_FIVE_TRAITS: TraitDefinition[] = [
  TRAIT_OPENNESS,
  TRAIT_CONSCIENTIOUSNESS,
  TRAIT_EXTRAVERSION,
  TRAIT_AGREEABLENESS,
  TRAIT_NEUROTICISM,
];

// =============================================================================
// LIKERT SCALE OPTIONS
// =============================================================================

const LIKERT_5_OPTIONS = [
  { value: 1, label: 'Stimme gar nicht zu' },
  { value: 2, label: 'Stimme eher nicht zu' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Stimme eher zu' },
  { value: 5, label: 'Stimme voll zu' },
];

// =============================================================================
// PERSONALITY QUIZ - Big Five Schnelltest
// =============================================================================

const personalityQuestions: QuestionDefinition[] = [
  // Openness questions
  {
    questionId: 'o1',
    text: 'Ich bin neugierig auf viele verschiedene Dinge.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'o1',
      traitWeights: { openness: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'o2',
    text: 'Ich habe eine lebhafte Vorstellungskraft.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'o2',
      traitWeights: { openness: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  // Conscientiousness questions
  {
    questionId: 'c1',
    text: 'Ich erledige Aufgaben gründlich.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'c1',
      traitWeights: { conscientiousness: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'c2',
    text: 'Ich mache Pläne und halte mich daran.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'c2',
      traitWeights: { conscientiousness: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  // Extraversion questions
  {
    questionId: 'e1',
    text: 'Ich bin gesprächig.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'e1',
      traitWeights: { extraversion: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'e2',
    text: 'Ich bin voller Energie.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'e2',
      traitWeights: { extraversion: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'e3',
    text: 'Ich bin eher zurückhaltend.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'e3',
      traitWeights: { extraversion: 1.0 },
      scoreMapping: createInvertedMapping(1, 5), // Inverted - low answer = high extraversion
    },
  },
  // Agreeableness questions
  {
    questionId: 'a1',
    text: 'Ich bin hilfsbereit und selbstlos.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'a1',
      traitWeights: { agreeableness: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'a2',
    text: 'Ich vertraue anderen Menschen.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'a2',
      traitWeights: { agreeableness: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  // Neuroticism questions
  {
    questionId: 'n1',
    text: 'Ich mache mir oft Sorgen.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'n1',
      traitWeights: { neuroticism: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'n2',
    text: 'Ich fühle mich leicht gestresst.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'n2',
      traitWeights: { neuroticism: 1.0 },
      scoreMapping: createLikertMapping(5),
    },
  },
  {
    questionId: 'n3',
    text: 'Ich bin emotional stabil.',
    options: LIKERT_5_OPTIONS,
    traitMapping: {
      questionId: 'n3',
      traitWeights: { neuroticism: 1.0 },
      scoreMapping: createInvertedMapping(1, 5), // Inverted
    },
  },
];

export const PERSONALITY_QUIZ: QuizDefinition = {
  quizId: 'big-five-quick',
  name: 'Persönlichkeits-Schnelltest',
  description: 'Ermittle deine Big Five Persönlichkeitsmerkmale in nur 5 Minuten',
  category: 'personality',
  questions: personalityQuestions,
  estimatedMinutes: 5,
  version: 1,
};

// =============================================================================
// ALL PREDEFINED DATA
// =============================================================================

export const ALL_TRAITS: TraitDefinition[] = [...BIG_FIVE_TRAITS];

export const ALL_QUIZZES: QuizDefinition[] = [PERSONALITY_QUIZ];

/**
 * Initialize a registry with all predefined traits and quizzes
 */
export function initializeRegistry(registry: {
  registerTrait: (trait: TraitDefinition) => void;
  registerQuiz: (quiz: QuizDefinition) => void;
}): void {
  // Register all traits
  for (const trait of ALL_TRAITS) {
    registry.registerTrait(trait);
  }

  // Register all quizzes
  for (const quiz of ALL_QUIZZES) {
    registry.registerQuiz(quiz);
  }
}
