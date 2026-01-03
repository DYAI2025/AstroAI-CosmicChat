/**
 * API Types
 *
 * Request/Response DTOs for QuizzMe API endpoints.
 * Layer-neutral: defines the contract between frontend and backend.
 */

import type {
  AstrologicalProfile,
  BirthData,
  PsychologicalProfile,
  UnifiedSnapshot,
} from './profile';
import type { QuizResponse, TraitScore } from './quiz';

// ============================================================================
// Common API Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;

  /** Response data (present on success) */
  data?: T;

  /** Error information (present on failure) */
  error?: ApiError;

  /** Request metadata */
  meta?: ResponseMeta;
}

/**
 * API error details
 */
export interface ApiError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Detailed error information */
  details?: Record<string, unknown>;

  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * Response metadata
 */
export interface ResponseMeta {
  /** Request ID for tracing */
  requestId: string;

  /** Response timestamp */
  timestamp: string;

  /** API version */
  version: string;

  /** Processing time in milliseconds */
  processingTimeMs: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page: number;

  /** Items per page */
  limit: number;

  /** Sort field */
  sortBy?: string;

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /** Items for the current page */
  items: T[];

  /** Total number of items */
  total: number;

  /** Current page number */
  page: number;

  /** Items per page */
  limit: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there's a next page */
  hasNextPage: boolean;

  /** Whether there's a previous page */
  hasPreviousPage: boolean;
}

// ============================================================================
// /api/astro/compute - Astrological Computation Endpoint
// ============================================================================

/**
 * Request to compute an astrological chart
 * POST /api/astro/compute
 */
export interface AstroComputeRequest {
  /** User ID to associate the chart with */
  userId: string;

  /** Birth data for chart calculation */
  birthData: BirthData;

  /** Calculation options */
  options?: AstroComputeOptions;
}

/**
 * Options for astrological computation
 */
export interface AstroComputeOptions {
  /** House system to use */
  houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch' | 'campanus';

  /** Whether to include minor aspects */
  includeMinorAspects?: boolean;

  /** Maximum orb for aspects (degrees) */
  maxOrb?: number;

  /** Whether to include asteroids */
  includeAsteroids?: boolean;

  /** Whether to include fixed stars */
  includeFixedStars?: boolean;
}

/**
 * Response from astrological computation
 */
export interface AstroComputeResponse {
  /** Computed astrological profile */
  profile: AstrologicalProfile;

  /** Calculation metadata */
  calculation: {
    /** Algorithm version used */
    algorithmVersion: string;

    /** Ephemeris used */
    ephemeris: string;

    /** House system used */
    houseSystem: string;

    /** Computation time in milliseconds */
    computeTimeMs: number;
  };
}

// ============================================================================
// /api/contribute - Quiz Response Contribution Endpoint
// ============================================================================

/**
 * Request to submit a quiz response
 * POST /api/contribute
 */
export interface ContributeRequest {
  /** User ID submitting the response */
  userId: string;

  /** Quiz ID being completed */
  quizId: string;

  /** Quiz response data */
  response: Omit<QuizResponse, 'id' | 'scores' | 'scoringVersion'>;

  /** Client-side metadata */
  clientMeta?: ContributeClientMeta;
}

/**
 * Client-side metadata for contribution tracking
 */
export interface ContributeClientMeta {
  /** Client application identifier */
  clientId: string;

  /** Client version */
  clientVersion: string;

  /** User agent string */
  userAgent?: string;

  /** Session ID */
  sessionId?: string;

  /** Locale/language */
  locale?: string;
}

/**
 * Response from contributing a quiz response
 */
export interface ContributeResponse {
  /** Generated response ID */
  responseId: string;

  /** Computed trait scores */
  scores: TraitScore[];

  /** Updated psychological profile */
  updatedProfile: PsychologicalProfile;

  /** Whether this unlocked new features/quizzes */
  unlocked?: UnlockedContent[];

  /** Scoring version used */
  scoringVersion: string;
}

/**
 * Content unlocked by contribution
 */
export interface UnlockedContent {
  /** Type of content unlocked */
  type: 'quiz' | 'feature' | 'insight' | 'badge';

  /** Content identifier */
  id: string;

  /** Display name */
  name: string;

  /** Description */
  description?: string;
}

// ============================================================================
// /api/profile/snapshot - Profile Snapshot Endpoint
// ============================================================================

/**
 * Request to get a unified profile snapshot
 * GET /api/profile/snapshot?userId=...
 */
export interface ProfileSnapshotRequest {
  /** User ID to get snapshot for */
  userId: string;

  /** Whether to include full details */
  includeDetails?: boolean;

  /** Whether to force refresh (bypass cache) */
  forceRefresh?: boolean;

  /** Specific sections to include */
  sections?: ProfileSection[];
}

/**
 * Profile sections that can be requested
 */
export type ProfileSection =
  | 'psychological'
  | 'astrological'
  | 'insights'
  | 'history'
  | 'compatibility';

/**
 * Response with unified profile snapshot
 */
export interface ProfileSnapshotResponse {
  /** The unified snapshot */
  snapshot: UnifiedSnapshot;

  /** Whether this was served from cache */
  cached: boolean;

  /** Cache age in seconds (if cached) */
  cacheAge?: number;

  /** Next recommended refresh time */
  refreshAfter?: string;
}

/**
 * Request to update profile data
 * PATCH /api/profile/snapshot
 */
export interface ProfileUpdateRequest {
  /** User ID to update */
  userId: string;

  /** Psychological profile updates */
  psychological?: Partial<PsychologicalProfile>;

  /** Astrological profile updates (typically birth data changes) */
  astrological?: {
    birthData: BirthData;
    recompute: boolean;
  };
}

/**
 * Response from profile update
 */
export interface ProfileUpdateResponse {
  /** Updated snapshot */
  snapshot: UnifiedSnapshot;

  /** Fields that were updated */
  updatedFields: string[];

  /** Whether recomputation was triggered */
  recomputed: boolean;
}

// ============================================================================
// Validation Schemas (for runtime validation)
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Validation errors */
  errors: ValidationError[];
}

/**
 * Single validation error
 */
export interface ValidationError {
  /** Field path that failed validation */
  path: string;

  /** Error code */
  code: string;

  /** Human-readable message */
  message: string;

  /** Expected value/format */
  expected?: string;

  /** Actual value received */
  received?: string;
}

// ============================================================================
// WebSocket Events (for real-time updates)
// ============================================================================

/**
 * WebSocket event types
 */
export type WebSocketEventType =
  | 'profile:updated'
  | 'quiz:progress'
  | 'insight:generated'
  | 'sync:status';

/**
 * WebSocket event payload
 */
export interface WebSocketEvent<T = unknown> {
  /** Event type */
  type: WebSocketEventType;

  /** User ID this event relates to */
  userId: string;

  /** Event payload */
  payload: T;

  /** Event timestamp */
  timestamp: string;
}

/**
 * Profile updated event payload
 */
export interface ProfileUpdatedPayload {
  /** Updated snapshot version */
  version: number;

  /** Sections that changed */
  changedSections: ProfileSection[];
}

/**
 * Quiz progress event payload
 */
export interface QuizProgressPayload {
  /** Quiz ID */
  quizId: string;

  /** Current progress percentage */
  progress: number;

  /** Estimated time remaining (seconds) */
  estimatedRemaining?: number;
}
