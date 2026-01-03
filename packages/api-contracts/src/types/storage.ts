/**
 * Storage Types
 *
 * Interfaces for storage abstraction layer.
 * Enables swappable storage backends (localStorage, IndexedDB, remote APIs).
 * Layer-neutral: can be used by both UI and domain layers.
 */

/**
 * Core storage provider interface for key-value operations.
 * Implementations can use localStorage, IndexedDB, or remote storage.
 */
export interface StorageProvider {
  /**
   * Retrieve a value by key
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store a value with a key
   * @param key - The storage key
   * @param value - The value to store
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Delete a value by key
   * @param key - The storage key to delete
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a key exists
   * @param key - The storage key
   * @returns Whether the key exists
   */
  exists(key: string): Promise<boolean>;

  /**
   * Get all keys matching a pattern
   * @param pattern - Optional pattern to filter keys (glob-style)
   * @returns Array of matching keys
   */
  keys(pattern?: string): Promise<string[]>;

  /**
   * Clear all stored data
   */
  clear(): Promise<void>;
}

/**
 * Extended storage provider with TTL support
 */
export interface CacheableStorageProvider extends StorageProvider {
  /**
   * Store a value with expiration
   * @param key - The storage key
   * @param value - The value to store
   * @param ttlMs - Time to live in milliseconds
   */
  setWithTTL<T>(key: string, value: T, ttlMs: number): Promise<void>;

  /**
   * Get remaining TTL for a key
   * @param key - The storage key
   * @returns Remaining TTL in milliseconds, or null if no TTL/not found
   */
  getTTL(key: string): Promise<number | null>;

  /**
   * Extend the TTL for a key
   * @param key - The storage key
   * @param additionalMs - Additional milliseconds to add
   */
  extendTTL(key: string, additionalMs: number): Promise<void>;
}

/**
 * Storage provider types
 */
export type StorageType =
  | 'memory'       // In-memory (for testing/SSR)
  | 'localStorage' // Browser localStorage
  | 'indexedDB'    // Browser IndexedDB
  | 'remote'       // Remote API storage
  | 'hybrid';      // Combination (local cache + remote sync)

/**
 * Configuration for storage providers
 */
export interface StoreConfig {
  /** Type of storage provider */
  type: StorageType;

  /** Namespace/prefix for all keys */
  namespace: string;

  /** Default TTL for cached items (milliseconds) */
  defaultTTL?: number;

  /** Maximum number of items to store (for memory/localStorage) */
  maxItems?: number;

  /** Maximum storage size in bytes (approximate) */
  maxSizeBytes?: number;

  /** Whether to encrypt stored data */
  encrypt?: boolean;

  /** Encryption key (required if encrypt is true) */
  encryptionKey?: string;

  /** Remote API configuration (required for 'remote' or 'hybrid' types) */
  remoteConfig?: RemoteStorageConfig;

  /** Sync configuration (for 'hybrid' type) */
  syncConfig?: SyncConfig;

  /** Serialization configuration */
  serialization?: SerializationConfig;
}

/**
 * Configuration for remote storage API
 */
export interface RemoteStorageConfig {
  /** Base URL for the storage API */
  baseUrl: string;

  /** Authentication token or API key */
  authToken?: string;

  /** Request timeout in milliseconds */
  timeoutMs: number;

  /** Number of retry attempts on failure */
  retryAttempts: number;

  /** Headers to include in requests */
  headers?: Record<string, string>;
}

/**
 * Configuration for hybrid storage sync
 */
export interface SyncConfig {
  /** Sync strategy */
  strategy: 'write-through' | 'write-behind' | 'read-through';

  /** Interval for background sync (milliseconds) */
  syncIntervalMs?: number;

  /** Whether to sync on window focus */
  syncOnFocus: boolean;

  /** Conflict resolution strategy */
  conflictResolution: 'local-wins' | 'remote-wins' | 'latest-wins';

  /** Keys to exclude from sync */
  excludeKeys?: string[];
}

/**
 * Serialization configuration
 */
export interface SerializationConfig {
  /** Custom serializer function */
  serialize?: <T>(value: T) => string;

  /** Custom deserializer function */
  deserialize?: <T>(value: string) => T;

  /** Date handling strategy */
  dateHandling: 'iso-string' | 'timestamp' | 'preserve';
}

/**
 * Storage event types for observability
 */
export type StorageEventType =
  | 'get'
  | 'set'
  | 'delete'
  | 'clear'
  | 'sync'
  | 'error';

/**
 * Storage event for logging/monitoring
 */
export interface StorageEvent {
  /** Event type */
  type: StorageEventType;

  /** Storage key involved */
  key?: string;

  /** Timestamp of the event */
  timestamp: Date;

  /** Duration of the operation (milliseconds) */
  durationMs?: number;

  /** Whether the operation succeeded */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Storage statistics
 */
export interface StorageStats {
  /** Total number of items */
  itemCount: number;

  /** Approximate total size in bytes */
  sizeBytes: number;

  /** Oldest item timestamp */
  oldestItem?: Date;

  /** Newest item timestamp */
  newestItem?: Date;

  /** Cache hit rate (0-1) */
  hitRate?: number;

  /** Number of operations since last reset */
  operationCount: Record<StorageEventType, number>;
}

/**
 * Storage migration for schema changes
 */
export interface StorageMigration {
  /** Migration version */
  version: number;

  /** Description of the migration */
  description: string;

  /** Migration function */
  migrate: (provider: StorageProvider) => Promise<void>;

  /** Rollback function (optional) */
  rollback?: (provider: StorageProvider) => Promise<void>;
}
