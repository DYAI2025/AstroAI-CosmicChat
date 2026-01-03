/**
 * Internal types for the Trait Engine
 * These types are used within the engine for processing and calculations
 */

/**
 * Represents a single answer to a quiz question
 */
export interface QuizAnswer {
  /** Unique identifier for the question */
  questionId: string;
  /** The quiz this answer belongs to */
  quizId: string;
  /** The selected option index or value */
  selectedValue: number | string;
  /** Optional weight modifier for this answer */
  weight?: number;
  /** Timestamp when the answer was recorded */
  timestamp: number;
}

/**
 * A trait score resulting from quiz answer processing
 */
export interface TraitScore {
  /** The trait dimension being measured */
  traitId: string;
  /** Normalized score between 0 and 1 */
  score: number;
  /** Confidence level of this score (0-1) */
  confidence: number;
  /** Source quiz that contributed to this score */
  sourceQuizId: string;
  /** Number of questions that contributed */
  questionCount: number;
}

/**
 * Mapping of a question to trait dimensions
 */
export interface QuestionTraitMapping {
  /** Question identifier */
  questionId: string;
  /** Map of trait IDs to their weight for this question */
  traitWeights: Record<string, number>;
  /** How the answer value maps to trait scores */
  scoreMapping: AnswerScoreMapping;
}

/**
 * Defines how answer values map to scores
 */
export interface AnswerScoreMapping {
  /** Type of mapping */
  type: 'linear' | 'discrete' | 'inverted';
  /** For discrete mapping: value -> score pairs */
  discreteValues?: Record<string | number, number>;
  /** For linear: min and max of the scale */
  scale?: {
    min: number;
    max: number;
  };
}

/**
 * Aggregated trait data for a specific dimension
 */
export interface AggregatedTrait {
  /** Trait identifier */
  traitId: string;
  /** Aggregated score (0-1) */
  aggregatedScore: number;
  /** Overall confidence based on data points */
  confidence: number;
  /** Number of data points contributing */
  dataPoints: number;
  /** Timestamp of last update */
  lastUpdated: number;
}

/**
 * A snapshot of the complete profile at a point in time
 */
export interface ProfileSnapshot {
  /** Unique snapshot identifier */
  snapshotId: string;
  /** When the snapshot was taken */
  timestamp: number;
  /** All aggregated trait scores */
  traits: AggregatedTrait[];
  /** Profile completeness (0-1) */
  completeness: number;
  /** Quizzes that contributed to this snapshot */
  contributingQuizIds: string[];
}

/**
 * Complete psychological profile state
 */
export interface PsychologicalProfile {
  /** Unique profile identifier */
  profileId: string;
  /** User this profile belongs to */
  userId: string;
  /** Current trait scores */
  traits: Map<string, TraitHistory>;
  /** When profile was created */
  createdAt: number;
  /** When profile was last updated */
  updatedAt: number;
  /** Version for optimistic concurrency */
  version: number;
}

/**
 * Historical data for a single trait
 */
export interface TraitHistory {
  /** Trait identifier */
  traitId: string;
  /** Current aggregated score */
  currentScore: number;
  /** Current confidence level */
  currentConfidence: number;
  /** Historical score entries */
  history: TraitHistoryEntry[];
}

/**
 * A single entry in trait history
 */
export interface TraitHistoryEntry {
  /** Score at this point */
  score: number;
  /** Confidence at this point */
  confidence: number;
  /** When this was recorded */
  timestamp: number;
  /** Source that contributed this entry */
  sourceQuizId: string;
}

/**
 * Configuration for score calculation
 */
export interface CalculationConfig {
  /** How to weight recent vs old scores */
  recencyDecay: number;
  /** Minimum confidence threshold */
  minConfidenceThreshold: number;
  /** Maximum history entries to keep per trait */
  maxHistoryEntries: number;
  /** Default weight for unspecified answers */
  defaultWeight: number;
}

/**
 * Result of a calculation operation
 */
export interface CalculationResult<T> {
  /** Whether calculation succeeded */
  success: boolean;
  /** Result data if successful */
  data?: T;
  /** Error message if failed */
  error?: string;
  /** Warnings that didn't prevent calculation */
  warnings: string[];
}
