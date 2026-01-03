/**
 * @quizzme/api-contracts
 *
 * Shared API contracts and types for QuizzMe.
 * Layer-neutral types that can be used by both UI and domain layers
 * without creating circular dependencies.
 *
 * @packageDocumentation
 */

// ============================================================================
// Core Type Exports
// ============================================================================

// Profile types
export type {
  PsychologicalProfile,
  AstrologicalProfile,
  UnifiedSnapshot,
  ProfileInsight,
  ZodiacSign,
  Planet,
  House,
  PlanetaryPlacement,
  Aspect,
  BirthData,
} from './types/profile';

// Quiz types
export type {
  TraitScore,
  QuestionType,
  QuizQuestion,
  QuizOption,
  ScaleConfig,
  QuizAnswer,
  QuizResponse,
  Quiz,
  QuizCategory,
  QuizProgress,
} from './types/quiz';

// Storage types
export type {
  StorageProvider,
  CacheableStorageProvider,
  StorageType,
  StoreConfig,
  RemoteStorageConfig,
  SyncConfig,
  SerializationConfig,
  StorageEventType,
  StorageEvent,
  StorageStats,
  StorageMigration,
} from './types/storage';

// API types
export type {
  // Common
  ApiResponse,
  ApiError,
  ResponseMeta,
  PaginationParams,
  PaginatedResponse,
  // Astro compute
  AstroComputeRequest,
  AstroComputeOptions,
  AstroComputeResponse,
  // Contribute
  ContributeRequest,
  ContributeClientMeta,
  ContributeResponse,
  UnlockedContent,
  // Profile snapshot
  ProfileSnapshotRequest,
  ProfileSection,
  ProfileSnapshotResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  // Validation
  ValidationResult,
  ValidationError,
  // WebSocket
  WebSocketEventType,
  WebSocketEvent,
  ProfileUpdatedPayload,
  QuizProgressPayload,
} from './types/api';

// ============================================================================
// Re-export all types for convenience
// ============================================================================

export * from './types';
