/**
 * Score calculation logic for the Trait Engine
 * All calculations are pure functions with no side effects
 */

import type {
  QuizAnswer,
  TraitScore,
  QuestionTraitMapping,
  AnswerScoreMapping,
  CalculationConfig,
  CalculationResult,
  AggregatedTrait,
  TraitHistory,
  TraitHistoryEntry,
} from './types';

/**
 * Default calculation configuration
 */
export const DEFAULT_CALCULATION_CONFIG: CalculationConfig = {
  recencyDecay: 0.95,
  minConfidenceThreshold: 0.1,
  maxHistoryEntries: 100,
  defaultWeight: 1.0,
};

/**
 * Normalizes a raw score to the 0-1 range
 */
export function normalizeScore(
  rawScore: number,
  min: number,
  max: number
): number {
  if (max === min) return 0.5;
  const normalized = (rawScore - min) / (max - min);
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Calculates a single answer's contribution to trait scores
 */
export function calculateAnswerScore(
  answer: QuizAnswer,
  mapping: QuestionTraitMapping
): CalculationResult<Map<string, number>> {
  const warnings: string[] = [];
  const traitScores = new Map<string, number>();

  // Get the raw score from the answer value
  const rawScore = getScoreFromMapping(
    answer.selectedValue,
    mapping.scoreMapping
  );

  if (rawScore === null) {
    return {
      success: false,
      error: `Unable to map answer value: ${answer.selectedValue}`,
      warnings,
    };
  }

  // Apply weight if specified
  const weight = answer.weight ?? 1.0;

  // Calculate contribution to each trait
  for (const [traitId, traitWeight] of Object.entries(mapping.traitWeights)) {
    const score = rawScore * traitWeight * weight;
    traitScores.set(traitId, score);
  }

  return {
    success: true,
    data: traitScores,
    warnings,
  };
}

/**
 * Maps an answer value to a raw score based on mapping configuration
 */
function getScoreFromMapping(
  value: number | string,
  mapping: AnswerScoreMapping
): number | null {
  switch (mapping.type) {
    case 'discrete': {
      const discreteScore = mapping.discreteValues?.[value];
      return discreteScore !== undefined ? discreteScore : null;
    }

    case 'linear': {
      if (typeof value !== 'number' || !mapping.scale) return null;
      return normalizeScore(value, mapping.scale.min, mapping.scale.max);
    }

    case 'inverted': {
      if (typeof value !== 'number' || !mapping.scale) return null;
      const normalized = normalizeScore(value, mapping.scale.min, mapping.scale.max);
      return 1 - normalized;
    }

    default:
      return null;
  }
}

/**
 * Aggregates multiple trait scores into final scores
 */
export function aggregateTraitScores(
  scores: Map<string, number[]>,
  config: CalculationConfig = DEFAULT_CALCULATION_CONFIG
): Map<string, TraitScore> {
  const aggregated = new Map<string, TraitScore>();

  for (const [traitId, scoreArray] of scores.entries()) {
    if (scoreArray.length === 0) continue;

    // Calculate weighted average with recency decay
    let totalWeight = 0;
    let weightedSum = 0;

    for (let i = 0; i < scoreArray.length; i++) {
      // More recent scores (higher index) get higher weight
      const recencyWeight = Math.pow(config.recencyDecay, scoreArray.length - 1 - i);
      const score = scoreArray[i];
      if (score !== undefined) {
        weightedSum += score * recencyWeight;
        totalWeight += recencyWeight;
      }
    }

    const aggregatedScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    // Confidence based on number of data points
    const confidence = calculateConfidence(scoreArray.length);

    aggregated.set(traitId, {
      traitId,
      score: aggregatedScore,
      confidence,
      sourceQuizId: '', // Will be set by caller
      questionCount: scoreArray.length,
    });
  }

  return aggregated;
}

/**
 * Calculates confidence based on number of data points
 * Uses logarithmic scaling to prevent confidence from growing too quickly
 */
export function calculateConfidence(dataPoints: number): number {
  if (dataPoints === 0) return 0;
  // Logarithmic scaling: approaches 1 as data points increase
  // ~0.69 at 10 points, ~0.87 at 50 points, ~0.95 at 100 points
  return Math.min(1, Math.log10(dataPoints + 1) / 2);
}

/**
 * Merges new trait scores with existing trait history
 */
export function mergeTraitScores(
  existing: TraitHistory | undefined,
  newScore: TraitScore,
  config: CalculationConfig = DEFAULT_CALCULATION_CONFIG
): TraitHistory {
  const now = Date.now();

  const newEntry: TraitHistoryEntry = {
    score: newScore.score,
    confidence: newScore.confidence,
    timestamp: now,
    sourceQuizId: newScore.sourceQuizId,
  };

  if (!existing) {
    return {
      traitId: newScore.traitId,
      currentScore: newScore.score,
      currentConfidence: newScore.confidence,
      history: [newEntry],
    };
  }

  // Add new entry to history
  const updatedHistory = [...existing.history, newEntry];

  // Trim history if needed
  const trimmedHistory = updatedHistory.slice(-config.maxHistoryEntries);

  // Calculate new aggregated score
  const { score: aggregatedScore, confidence: aggregatedConfidence } =
    calculateAggregatedScore(trimmedHistory, config);

  return {
    traitId: existing.traitId,
    currentScore: aggregatedScore,
    currentConfidence: aggregatedConfidence,
    history: trimmedHistory,
  };
}

/**
 * Calculates aggregated score from history entries
 */
function calculateAggregatedScore(
  history: TraitHistoryEntry[],
  config: CalculationConfig
): { score: number; confidence: number } {
  if (history.length === 0) {
    return { score: 0, confidence: 0 };
  }

  const now = Date.now();
  let totalWeight = 0;
  let weightedSum = 0;
  let confidenceSum = 0;

  for (const entry of history) {
    // Time-based decay (older entries have less weight)
    const ageInDays = (now - entry.timestamp) / (1000 * 60 * 60 * 24);
    const timeDecay = Math.pow(config.recencyDecay, ageInDays);

    const weight = entry.confidence * timeDecay;
    weightedSum += entry.score * weight;
    totalWeight += weight;
    confidenceSum += entry.confidence;
  }

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const avgConfidence = confidenceSum / history.length;

  // Combine average confidence with data point confidence
  const dataPointConfidence = calculateConfidence(history.length);
  const confidence = (avgConfidence + dataPointConfidence) / 2;

  return { score, confidence };
}

/**
 * Creates aggregated traits from profile trait histories
 */
export function createAggregatedTraits(
  traits: Map<string, TraitHistory>
): AggregatedTrait[] {
  const now = Date.now();
  const aggregated: AggregatedTrait[] = [];

  for (const [traitId, history] of traits.entries()) {
    aggregated.push({
      traitId,
      aggregatedScore: history.currentScore,
      confidence: history.currentConfidence,
      dataPoints: history.history.length,
      lastUpdated: history.history.length > 0
        ? history.history[history.history.length - 1]?.timestamp ?? now
        : now,
    });
  }

  return aggregated;
}

/**
 * Calculates profile completeness based on trait coverage
 */
export function calculateCompleteness(
  filledTraits: number,
  totalTraits: number,
  _minConfidence: number = 0.3
): number {
  if (totalTraits === 0) return 0;
  return Math.min(1, filledTraits / totalTraits);
}

/**
 * Validates that a score is within valid bounds
 */
export function isValidScore(score: number): boolean {
  return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 1;
}

/**
 * Clamps a score to valid bounds
 */
export function clampScore(score: number): number {
  if (!isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}
