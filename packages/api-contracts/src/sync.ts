/**
 * Sync Types
 *
 * Defines the contract for real-time synchronization across devices.
 */

// =============================================================================
// SYNC STATE
// =============================================================================

/**
 * Sync status
 */
export type SyncStatus =
  | 'idle'
  | 'syncing'
  | 'synced'
  | 'offline'
  | 'error'
  | 'conflict';

/**
 * Sync state
 */
export interface SyncState {
  /** Current sync status */
  status: SyncStatus;
  /** Last successful sync timestamp */
  lastSyncAt: number | null;
  /** Number of pending changes */
  pendingChanges: number;
  /** Error message if status is 'error' */
  error?: string;
  /** Whether device is online */
  isOnline: boolean;
}

// =============================================================================
// SYNC OPERATIONS
// =============================================================================

/**
 * Sync operation type
 */
export type SyncOperationType = 'create' | 'update' | 'delete';

/**
 * Sync operation (queued change)
 */
export interface SyncOperation<T = unknown> {
  /** Unique operation ID */
  id: string;
  /** Operation type */
  type: SyncOperationType;
  /** Entity type (profile, quiz_result, etc.) */
  entityType: string;
  /** Entity ID */
  entityId: string;
  /** The data to sync */
  payload: T;
  /** When the operation was queued */
  timestamp: number;
  /** Number of retry attempts */
  retryCount: number;
  /** Last error if failed */
  lastError?: string;
}

/**
 * Sync result
 */
export interface SyncResult {
  success: boolean;
  syncedOperations: string[];
  failedOperations: Array<{
    operationId: string;
    error: string;
  }>;
  serverTimestamp: number;
}

// =============================================================================
// CONFLICT RESOLUTION
// =============================================================================

/**
 * Conflict type
 */
export type ConflictType = 'concurrent_update' | 'delete_update' | 'version_mismatch';

/**
 * Sync conflict
 */
export interface SyncConflict<T = unknown> {
  /** Conflict ID */
  id: string;
  /** Type of conflict */
  type: ConflictType;
  /** Entity type */
  entityType: string;
  /** Entity ID */
  entityId: string;
  /** Local version */
  localData: T;
  /** Server version */
  serverData: T;
  /** When the conflict was detected */
  detectedAt: number;
}

/**
 * Conflict resolution strategy
 */
export type ConflictResolution = 'keep_local' | 'keep_server' | 'merge';

// =============================================================================
// SYNC SERVICE INTERFACE
// =============================================================================

/**
 * Sync service interface
 */
export interface SyncService {
  /**
   * Get current sync state
   */
  getState(): SyncState;

  /**
   * Subscribe to sync state changes
   */
  onStateChange(callback: (state: SyncState) => void): () => void;

  /**
   * Queue an operation for sync
   */
  queueOperation<T>(operation: Omit<SyncOperation<T>, 'id' | 'timestamp' | 'retryCount'>): void;

  /**
   * Trigger immediate sync
   */
  sync(): Promise<SyncResult>;

  /**
   * Get pending operations
   */
  getPendingOperations(): SyncOperation[];

  /**
   * Get unresolved conflicts
   */
  getConflicts(): SyncConflict[];

  /**
   * Resolve a conflict
   */
  resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void>;

  /**
   * Pause syncing
   */
  pause(): void;

  /**
   * Resume syncing
   */
  resume(): void;
}

// =============================================================================
// WEBSOCKET EVENTS
// =============================================================================

/**
 * Sync WebSocket event types
 */
export type SyncEventType =
  | 'sync:started'
  | 'sync:completed'
  | 'sync:error'
  | 'sync:conflict'
  | 'remote:update'
  | 'connection:online'
  | 'connection:offline';

/**
 * Sync WebSocket event
 */
export interface SyncEvent<T = unknown> {
  type: SyncEventType;
  payload: T;
  timestamp: number;
}

/**
 * Remote update event payload
 */
export interface RemoteUpdatePayload {
  entityType: string;
  entityId: string;
  operation: SyncOperationType;
  data: unknown;
  updatedBy: string;
  timestamp: number;
}
