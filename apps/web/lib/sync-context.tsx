'use client';

/**
 * Sync Context - Real-time synchronization state management
 *
 * Provides sync state and operations across the app.
 * Currently implements offline-first with local queue.
 * Will connect to backend WebSocket in future iterations.
 */

import type {
  SyncState,
  SyncOperation,
  SyncResult,
  SyncConflict,
  ConflictResolution,
} from '@quizzme/api-contracts';
import { createLocalStorage } from '@quizzme/storage';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

import { useAuth } from './auth-context';

// =============================================================================
// CONSTANTS
// =============================================================================

const SYNC_QUEUE_KEY = 'sync_queue';
const SYNC_INTERVAL_MS = 30000; // 30 seconds

// =============================================================================
// CONTEXT
// =============================================================================

interface SyncContextValue {
  /** Current sync state */
  state: SyncState;
  /** Queue an operation for sync */
  queueOperation: <T>(
    entityType: string,
    entityId: string,
    type: 'create' | 'update' | 'delete',
    payload: T
  ) => void;
  /** Trigger immediate sync */
  sync: () => Promise<SyncResult>;
  /** Get pending operations count */
  pendingCount: number;
  /** Get unresolved conflicts */
  conflicts: SyncConflict[];
  /** Resolve a conflict */
  resolveConflict: (conflictId: string, resolution: ConflictResolution) => Promise<void>;
  /** Pause syncing */
  pause: () => void;
  /** Resume syncing */
  resume: () => void;
  /** Whether sync is paused */
  isPaused: boolean;
}

const SyncContext = createContext<SyncContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface SyncProviderProps {
  children: React.ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [storage] = useState(() => createLocalStorage({ prefix: 'quizzme_' }));

  const [state, setState] = useState<SyncState>({
    status: 'idle',
    lastSyncAt: null,
    pendingChanges: 0,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  });

  const [queue, setQueue] = useState<SyncOperation[]>([]);
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load queue from storage on mount
  useEffect(() => {
    const loadQueue = async () => {
      if (!user) return;

      const savedQueue = await storage.get<SyncOperation[]>(`${user.id}_${SYNC_QUEUE_KEY}`);
      if (savedQueue) {
        setQueue(savedQueue);
        setState((prev) => ({ ...prev, pendingChanges: savedQueue.length }));
      }
    };

    loadQueue();
  }, [storage, user]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({ ...prev, isOnline: true, status: prev.status === 'offline' ? 'idle' : prev.status }));
    };

    const handleOffline = () => {
      setState((prev) => ({ ...prev, isOnline: false, status: 'offline' }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Setup sync interval
  useEffect(() => {
    if (!isAuthenticated || isPaused) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    // Start sync interval
    syncIntervalRef.current = setInterval(() => {
      if (queue.length > 0 && state.isOnline) {
        syncOperations();
      }
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isAuthenticated, isPaused, queue.length, state.isOnline]);

  /**
   * Generate operation ID
   */
  const generateOperationId = useCallback(() => {
    return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  /**
   * Queue an operation for sync
   */
  const queueOperation = useCallback(
    async <T,>(
      entityType: string,
      entityId: string,
      type: 'create' | 'update' | 'delete',
      payload: T
    ) => {
      if (!user) return;

      const operation: SyncOperation<T> = {
        id: generateOperationId(),
        type,
        entityType,
        entityId,
        payload,
        timestamp: Date.now(),
        retryCount: 0,
      };

      const newQueue = [...queue, operation];
      setQueue(newQueue);

      // Persist to storage
      await storage.set(`${user.id}_${SYNC_QUEUE_KEY}`, newQueue);

      setState((prev) => ({
        ...prev,
        pendingChanges: newQueue.length,
      }));
    },
    [queue, storage, user, generateOperationId]
  );

  /**
   * Sync operations with server
   */
  const syncOperations = useCallback(async (): Promise<SyncResult> => {
    if (!user || queue.length === 0 || !state.isOnline) {
      return {
        success: true,
        syncedOperations: [],
        failedOperations: [],
        serverTimestamp: Date.now(),
      };
    }

    setState((prev) => ({ ...prev, status: 'syncing' }));

    // TODO: Implement actual sync with backend
    // For now, we simulate a successful sync
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Clear queue (simulating successful sync)
    const syncedIds = queue.map((op) => op.id);
    setQueue([]);
    await storage.delete(`${user.id}_${SYNC_QUEUE_KEY}`);

    setState((prev) => ({
      ...prev,
      status: 'synced',
      lastSyncAt: Date.now(),
      pendingChanges: 0,
    }));

    return {
      success: true,
      syncedOperations: syncedIds,
      failedOperations: [],
      serverTimestamp: Date.now(),
    };
  }, [user, queue, state.isOnline, storage]);

  /**
   * Resolve a conflict
   */
  const resolveConflict = useCallback(
    async (conflictId: string, _resolution: ConflictResolution) => {
      // TODO: Implement conflict resolution
      setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
    },
    []
  );

  /**
   * Pause syncing
   */
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  /**
   * Resume syncing
   */
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const value: SyncContextValue = {
    state,
    queueOperation,
    sync: syncOperations,
    pendingCount: queue.length,
    conflicts,
    resolveConflict,
    pause,
    resume,
    isPaused,
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Use sync context
 */
export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}

/**
 * Use sync status
 */
export function useSyncStatus(): SyncState {
  const { state } = useSync();
  return state;
}
