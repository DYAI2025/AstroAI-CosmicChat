/**
 * Quiz Types
 *
 * Core types for quiz questions, answers, and scoring.
 * Layer-neutral: can be used by both UI and domain layers.
 */

/**
 * Represents a score for a psychological trait
 */
export interface TraitScore {
  /** The trait identifier */
  traitId: string;

  /** Display name for the trait */
  traitName: string;

  /** Raw score value */
  rawScore: number;

  /** Normalized score (0-100) */
  normalizedScore: number;

  /** Percentile rank compared to population */
  percentile?: number;

  /** Number of questions that contributed to this score */
  sampleSize: number;

  /** Confidence interval for the score */
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
}

/**
 * Types of quiz questions
 */
export type QuestionType =
  | 'likert'        // Strongly disagree to strongly agree scale
  | 'multiple'      // Multiple choice, single answer
  | 'ranking'       // Rank items in order
  | 'slider'        // Continuous scale
  | 'binary'        // Yes/No, True/False
  | 'open';         // Free text response

/**
 * Represents a single quiz question
 */
export interface QuizQuestion {
  /** Unique question identifier */
  id: string;

  /** The quiz this question belongs to */
  quizId: string;

  /** Question text */
  text: string;

  /** Additional context or instructions */
  helpText?: string;

  /** Type of question */
  type: QuestionType;

  /** Available options (for choice-based questions) */
  options?: QuizOption[];

  /** Configuration for slider/likert questions */
  scaleConfig?: ScaleConfig;

  /** Traits this question measures */
  targetTraits: string[];

  /** Question order within the quiz */
  order: number;

  /** Whether this question is required */
  required: boolean;

  /** Whether to reverse-score this question */
  reverseScored: boolean;

  /** Category/section grouping */
  category?: string;
}

/**
 * An option for multiple choice or ranking questions
 */
export interface QuizOption {
  /** Unique option identifier */
  id: string;

  /** Display text */
  text: string;

  /** Score value associated with this option */
  value: number;

  /** Optional image URL */
  imageUrl?: string;
}

/**
 * Configuration for scale-based questions (likert, slider)
 */
export interface ScaleConfig {
  /** Minimum value */
  min: number;

  /** Maximum value */
  max: number;

  /** Step increment */
  step: number;

  /** Label for minimum value */
  minLabel?: string;

  /** Label for maximum value */
  maxLabel?: string;

  /** Labels for intermediate points */
  intermediateLabels?: Record<number, string>;
}

/**
 * Represents a user's answer to a question
 */
export interface QuizAnswer {
  /** Question ID being answered */
  questionId: string;

  /** Selected option ID (for choice questions) */
  selectedOptionId?: string;

  /** Numeric value (for scale questions) */
  numericValue?: number;

  /** Text response (for open questions) */
  textValue?: string;

  /** Ranked option IDs (for ranking questions) */
  rankedOptionIds?: string[];

  /** Timestamp when answered */
  answeredAt: Date;

  /** Time spent on this question (milliseconds) */
  responseTimeMs?: number;
}

/**
 * Complete quiz response from a user
 */
export interface QuizResponse {
  /** Unique response identifier */
  id: string;

  /** User who took the quiz */
  userId: string;

  /** Quiz that was taken */
  quizId: string;

  /** All answers provided */
  answers: QuizAnswer[];

  /** When the quiz was started */
  startedAt: Date;

  /** When the quiz was completed */
  completedAt?: Date;

  /** Total time taken (milliseconds) */
  totalTimeMs?: number;

  /** Whether the response is complete */
  isComplete: boolean;

  /** Computed trait scores from this response */
  scores?: TraitScore[];

  /** Response version for scoring algorithm tracking */
  scoringVersion: string;
}

/**
 * Quiz metadata and configuration
 */
export interface Quiz {
  /** Unique quiz identifier */
  id: string;

  /** Display name */
  name: string;

  /** Description of what the quiz measures */
  description: string;

  /** Estimated time to complete (minutes) */
  estimatedMinutes: number;

  /** Number of questions */
  questionCount: number;

  /** Traits this quiz measures */
  measuredTraits: string[];

  /** Quiz category */
  category: QuizCategory;

  /** Whether the quiz is active */
  isActive: boolean;

  /** Minimum required answers for valid scoring */
  minRequiredAnswers: number;

  /** Version of the quiz */
  version: string;

  /** When the quiz was created */
  createdAt: Date;

  /** When the quiz was last updated */
  updatedAt: Date;
}

/**
 * Categories of quizzes
 */
export type QuizCategory =
  | 'personality'
  | 'cognitive'
  | 'emotional'
  | 'social'
  | 'values'
  | 'compatibility';

/**
 * Progress tracking for an in-progress quiz
 */
export interface QuizProgress {
  /** Quiz being taken */
  quizId: string;

  /** User taking the quiz */
  userId: string;

  /** Current question index */
  currentIndex: number;

  /** Total questions */
  totalQuestions: number;

  /** Percentage complete */
  percentComplete: number;

  /** Answers submitted so far */
  answeredQuestions: string[];

  /** Last activity timestamp */
  lastActivityAt: Date;
}
