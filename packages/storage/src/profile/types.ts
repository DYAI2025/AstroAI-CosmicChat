/**
 * Profile Storage Types
 *
 * Defines the contract for profile-specific storage operations.
 * This provides a higher-level abstraction over raw key-value storage
 * specifically designed for psychological profile management.
 */

/**
 * Stored profile data structure
 * This is the shape of data as it exists in storage
 */
export interface StoredProfile {
  /** Unique profile identifier */
  profileId: string;
  /** User identifier */
  userId: string;
  /** Profile version for conflict resolution */
  version: number;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Serialized trait data */
  traits: StoredTraitData[];
  /** Contributing quiz IDs */
  contributingQuizIds: string[];
}

/**
 * Stored trait data structure
 */
export interface StoredTraitData {
  /** Trait identifier */
  traitId: string;
  /** Current aggregated score (0-1) */
  aggregatedScore: number;
  /** Confidence level (0-1) */
  confidence: number;
  /** Number of data points */
  dataPoints: number;
  /** Last update timestamp */
  lastUpdated: number;
  /** Historical entries (limited) */
  history: StoredTraitHistoryEntry[];
}

/**
 * Stored trait history entry
 */
export interface StoredTraitHistoryEntry {
  /** Score at this point */
  score: number;
  /** Confidence at this point */
  confidence: number;
  /** Timestamp */
  timestamp: number;
  /** Source quiz ID */
  sourceQuizId: string;
}

/**
 * Profile snapshot for API responses and caching
 */
export interface StoredProfileSnapshot {
  /** Snapshot identifier */
  snapshotId: string;
  /** Profile this snapshot belongs to */
  profileId: string;
  /** When the snapshot was created */
  timestamp: number;
  /** All trait scores */
  traits: StoredSnapshotTrait[];
  /** Profile completeness (0-1) */
  completeness: number;
  /** Contributing quiz IDs */
  contributingQuizIds: string[];
}

/**
 * Trait data within a snapshot
 */
export interface StoredSnapshotTrait {
  /** Trait identifier */
  traitId: string;
  /** Aggregated score (0-1) */
  aggregatedScore: number;
  /** Confidence level (0-1) */
  confidence: number;
  /** Number of data points */
  dataPoints: number;
}

/**
 * Quiz result for storage
 */
export interface StoredQuizResult {
  /** Quiz identifier */
  quizId: string;
  /** User identifier */
  userId: string;
  /** When the quiz was completed */
  completedAt: number;
  /** Computed trait scores */
  traitScores: StoredTraitScore[];
}

/**
 * Individual trait score from a quiz
 */
export interface StoredTraitScore {
  /** Trait identifier */
  traitId: string;
  /** Computed score (0-1) */
  score: number;
  /** Confidence level */
  confidence: number;
  /** Number of questions that contributed */
  questionCount: number;
}

/**
 * Profile Storage Provider Interface
 *
 * Provides profile-specific storage operations.
 * Implementations can be LocalStorage-based, API-based, or hybrid.
 */
export interface ProfileStorageProvider {
  /**
   * Get a profile by user ID
   * @param userId - The user's identifier
   * @returns The stored profile or null if not found
   */
  getProfile(userId: string): Promise<StoredProfile | null>;

  /**
   * Save a profile
   * @param profile - The profile to save
   * @returns The saved profile with any server-side modifications
   */
  saveProfile(profile: StoredProfile): Promise<StoredProfile>;

  /**
   * Delete a profile
   * @param userId - The user's identifier
   */
  deleteProfile(userId: string): Promise<void>;

  /**
   * Get the latest snapshot for a user
   * @param userId - The user's identifier
   * @returns The latest snapshot or null if none exists
   */
  getLatestSnapshot(userId: string): Promise<StoredProfileSnapshot | null>;

  /**
   * Save a quiz result
   * @param result - The quiz result to save
   */
  saveQuizResult(result: StoredQuizResult): Promise<void>;

  /**
   * Get quiz history for a user
   * @param userId - The user's identifier
   * @param limit - Maximum number of results to return
   */
  getQuizHistory(userId: string, limit?: number): Promise<StoredQuizResult[]>;

  /**
   * Check if storage is available and connected
   */
  isAvailable(): Promise<boolean>;

  /**
   * Sync local changes with remote (for hybrid storage)
   * @returns true if sync was successful
   */
  sync?(): Promise<boolean>;
}

/**
 * Storage mode configuration
 */
export type StorageMode = 'local' | 'api' | 'hybrid';

/**
 * Profile storage configuration
 */
export interface ProfileStorageConfig {
  /** Storage mode */
  mode: StorageMode;
  /** Prefix for local storage keys */
  prefix?: string;
  /** API base URL (for api/hybrid modes) */
  apiBaseUrl?: string;
  /** Authentication token getter (for api/hybrid modes) */
  getAuthToken?: () => Promise<string | null>;
  /** Enable offline support (for hybrid mode) */
  offlineSupport?: boolean;
}
