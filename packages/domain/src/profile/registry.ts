/**
 * Quiz Registry
 * Manages quiz definitions and their trait mappings
 */

import type {
  QuestionTraitMapping,
  AnswerScoreMapping,
} from '../trait-engine/types';
import type { QuizRegistry } from '../trait-engine/engine';

/**
 * Complete quiz definition
 */
export interface QuizDefinition {
  /** Unique quiz identifier */
  quizId: string;
  /** Display name */
  name: string;
  /** Description of what the quiz measures */
  description: string;
  /** Category/type of quiz */
  category: QuizCategory;
  /** Question definitions with trait mappings */
  questions: QuestionDefinition[];
  /** Estimated time to complete in minutes */
  estimatedMinutes: number;
  /** Version for updates */
  version: number;
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
  | 'interests'
  | 'astrology';

/**
 * Question definition within a quiz
 */
export interface QuestionDefinition {
  /** Unique question identifier */
  questionId: string;
  /** Question text */
  text: string;
  /** Answer options */
  options: AnswerOption[];
  /** How this question maps to traits */
  traitMapping: QuestionTraitMapping;
}

/**
 * Answer option for a question
 */
export interface AnswerOption {
  /** Value to store when selected */
  value: number | string;
  /** Display text */
  label: string;
}

/**
 * Trait definition for the registry
 */
export interface TraitDefinition {
  /** Unique trait identifier */
  traitId: string;
  /** Display name */
  name: string;
  /** Description of what the trait measures */
  description: string;
  /** Category this trait belongs to */
  category: string;
  /** Low end of the scale label */
  lowLabel: string;
  /** High end of the scale label */
  highLabel: string;
}

/**
 * In-memory quiz registry implementation
 */
export class InMemoryQuizRegistry implements QuizRegistry {
  private quizzes = new Map<string, QuizDefinition>();
  private traits = new Map<string, TraitDefinition>();
  private mappingsCache = new Map<string, QuestionTraitMapping[]>();

  /**
   * Register a new quiz
   */
  registerQuiz(quiz: QuizDefinition): void {
    this.quizzes.set(quiz.quizId, quiz);
    this.invalidateMappingsCache(quiz.quizId);
  }

  /**
   * Unregister a quiz
   */
  unregisterQuiz(quizId: string): boolean {
    const removed = this.quizzes.delete(quizId);
    if (removed) {
      this.mappingsCache.delete(quizId);
    }
    return removed;
  }

  /**
   * Register a trait definition
   */
  registerTrait(trait: TraitDefinition): void {
    this.traits.set(trait.traitId, trait);
  }

  /**
   * Get a quiz definition by ID
   */
  getQuiz(quizId: string): QuizDefinition | undefined {
    return this.quizzes.get(quizId);
  }

  /**
   * Get trait mappings for a quiz (implements QuizRegistry interface)
   */
  getQuizMappings(quizId: string): QuestionTraitMapping[] | undefined {
    // Check cache first
    const cached = this.mappingsCache.get(quizId);
    if (cached) return cached;

    const quiz = this.quizzes.get(quizId);
    if (!quiz) return undefined;

    // Build mappings from questions
    const mappings = quiz.questions.map((q) => q.traitMapping);
    this.mappingsCache.set(quizId, mappings);

    return mappings;
  }

  /**
   * Get all trait IDs (implements QuizRegistry interface)
   */
  getAllTraitIds(): string[] {
    return Array.from(this.traits.keys());
  }

  /**
   * Get all registered quizzes
   */
  getAllQuizzes(): QuizDefinition[] {
    return Array.from(this.quizzes.values());
  }

  /**
   * Get quizzes by category
   */
  getQuizzesByCategory(category: QuizCategory): QuizDefinition[] {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.category === category
    );
  }

  /**
   * Get a trait definition by ID
   */
  getTrait(traitId: string): TraitDefinition | undefined {
    return this.traits.get(traitId);
  }

  /**
   * Get all trait definitions
   */
  getAllTraits(): TraitDefinition[] {
    return Array.from(this.traits.values());
  }

  /**
   * Get traits by category
   */
  getTraitsByCategory(category: string): TraitDefinition[] {
    return Array.from(this.traits.values()).filter(
      (trait) => trait.category === category
    );
  }

  /**
   * Check if a quiz exists
   */
  hasQuiz(quizId: string): boolean {
    return this.quizzes.has(quizId);
  }

  /**
   * Check if a trait exists
   */
  hasTrait(traitId: string): boolean {
    return this.traits.has(traitId);
  }

  /**
   * Get quizzes that measure a specific trait
   */
  getQuizzesForTrait(traitId: string): QuizDefinition[] {
    const result: QuizDefinition[] = [];

    for (const quiz of this.quizzes.values()) {
      const hasTraitMapping = quiz.questions.some((q) =>
        Object.keys(q.traitMapping.traitWeights).includes(traitId)
      );
      if (hasTraitMapping) {
        result.push(quiz);
      }
    }

    return result;
  }

  /**
   * Get all traits measured by a specific quiz
   */
  getTraitsForQuiz(quizId: string): string[] {
    const quiz = this.quizzes.get(quizId);
    if (!quiz) return [];

    const traitIds = new Set<string>();
    for (const question of quiz.questions) {
      for (const traitId of Object.keys(question.traitMapping.traitWeights)) {
        traitIds.add(traitId);
      }
    }

    return Array.from(traitIds);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.quizzes.clear();
    this.traits.clear();
    this.mappingsCache.clear();
  }

  /**
   * Get statistics about the registry
   */
  getStats(): RegistryStats {
    return {
      quizCount: this.quizzes.size,
      traitCount: this.traits.size,
      totalQuestions: Array.from(this.quizzes.values()).reduce(
        (sum, quiz) => sum + quiz.questions.length,
        0
      ),
    };
  }

  private invalidateMappingsCache(quizId: string): void {
    this.mappingsCache.delete(quizId);
  }
}

/**
 * Registry statistics
 */
export interface RegistryStats {
  quizCount: number;
  traitCount: number;
  totalQuestions: number;
}

/**
 * Create a linear score mapping helper
 */
export function createLinearMapping(min: number, max: number): AnswerScoreMapping {
  return {
    type: 'linear',
    scale: { min, max },
  };
}

/**
 * Create an inverted linear score mapping helper
 */
export function createInvertedMapping(min: number, max: number): AnswerScoreMapping {
  return {
    type: 'inverted',
    scale: { min, max },
  };
}

/**
 * Create a discrete score mapping helper
 */
export function createDiscreteMapping(
  values: Record<string | number, number>
): AnswerScoreMapping {
  return {
    type: 'discrete',
    discreteValues: values,
  };
}

/**
 * Create a standard Likert scale mapping (1-5 or 1-7)
 */
export function createLikertMapping(points: 5 | 7 = 5): AnswerScoreMapping {
  return createLinearMapping(1, points);
}

/**
 * Factory function to create a quiz definition
 */
export function defineQuiz(
  quizId: string,
  name: string,
  options: {
    description: string;
    category: QuizCategory;
    estimatedMinutes: number;
    version?: number;
    questions: QuestionDefinition[];
  }
): QuizDefinition {
  return {
    quizId,
    name,
    description: options.description,
    category: options.category,
    questions: options.questions,
    estimatedMinutes: options.estimatedMinutes,
    version: options.version ?? 1,
  };
}

/**
 * Factory function to create a trait definition
 */
export function defineTrait(
  traitId: string,
  name: string,
  options: {
    description: string;
    category: string;
    lowLabel: string;
    highLabel: string;
  }
): TraitDefinition {
  return {
    traitId,
    name,
    ...options,
  };
}
