/**
 * Profile Types
 *
 * Core types for psychological and astrological profiles.
 * Layer-neutral: can be used by both UI and domain layers.
 */

import type { TraitScore } from './quiz';

/**
 * Represents a user's psychological profile derived from quiz responses.
 */
export interface PsychologicalProfile {
  /** Unique identifier for the user */
  userId: string;

  /** Map of trait names to their computed scores */
  traits: Record<string, TraitScore>;

  /** IDs of quizzes the user has completed */
  completedQuizzes: string[];

  /** Timestamp of the last profile update */
  lastUpdated: Date;
}

/**
 * Zodiac sign enumeration
 */
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

/**
 * Planetary body used in astrological calculations
 */
export type Planet =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto';

/**
 * Astrological house (1-12)
 */
export type House = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Represents a planetary placement in a chart
 */
export interface PlanetaryPlacement {
  /** The planet */
  planet: Planet;

  /** Zodiac sign the planet is in */
  sign: ZodiacSign;

  /** House the planet occupies */
  house: House;

  /** Degree within the sign (0-29) */
  degree: number;

  /** Whether the planet is retrograde */
  isRetrograde: boolean;
}

/**
 * Represents an aspect between two planets
 */
export interface Aspect {
  /** First planet in the aspect */
  planet1: Planet;

  /** Second planet in the aspect */
  planet2: Planet;

  /** Type of aspect */
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';

  /** Orb (degrees of separation from exact) */
  orb: number;

  /** Whether the aspect is applying or separating */
  applying: boolean;
}

/**
 * Birth data required for astrological calculations
 */
export interface BirthData {
  /** Date of birth (ISO 8601 format) */
  date: string;

  /** Time of birth (HH:MM format, 24-hour) */
  time: string;

  /** Latitude of birth location */
  latitude: number;

  /** Longitude of birth location */
  longitude: number;

  /** Timezone identifier (e.g., "America/New_York") */
  timezone: string;
}

/**
 * Represents a user's astrological profile/natal chart
 */
export interface AstrologicalProfile {
  /** Unique identifier for the user */
  userId: string;

  /** Birth data used for calculations */
  birthData: BirthData;

  /** Sun sign */
  sunSign: ZodiacSign;

  /** Moon sign */
  moonSign: ZodiacSign;

  /** Rising/Ascendant sign */
  risingSign: ZodiacSign;

  /** All planetary placements */
  placements: PlanetaryPlacement[];

  /** Aspects between planets */
  aspects: Aspect[];

  /** Timestamp when the chart was calculated */
  calculatedAt: Date;
}

/**
 * Unified snapshot combining psychological and astrological data
 * for a comprehensive user profile view
 */
export interface UnifiedSnapshot {
  /** Unique identifier for this snapshot */
  snapshotId: string;

  /** User's unique identifier */
  userId: string;

  /** Psychological profile data (optional if not yet computed) */
  psychological?: PsychologicalProfile;

  /** Astrological profile data (optional if birth data not provided) */
  astrological?: AstrologicalProfile;

  /** Combined insights derived from both profiles */
  insights: ProfileInsight[];

  /** Overall compatibility/harmony score between profiles */
  harmonyScore?: number;

  /** Timestamp when this snapshot was created */
  createdAt: Date;

  /** Snapshot version for cache invalidation */
  version: number;
}

/**
 * An insight derived from profile analysis
 */
export interface ProfileInsight {
  /** Unique identifier for this insight */
  id: string;

  /** Category of insight */
  category: 'strength' | 'challenge' | 'opportunity' | 'pattern';

  /** Source of the insight */
  source: 'psychological' | 'astrological' | 'combined';

  /** Title of the insight */
  title: string;

  /** Detailed description */
  description: string;

  /** Confidence level (0-1) */
  confidence: number;

  /** Related traits or placements */
  relatedElements: string[];
}
