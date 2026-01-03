/**
 * @quizzme/storage
 *
 * Storage abstraction layer for QuizzMe.
 *
 * This package provides a unified interface for storage operations,
 * allowing business logic to remain agnostic about WHERE data is stored.
 *
 * Currently supported:
 * - LocalStorage (browser) with SSR fallback
 * - Profile-specific storage with adapter pattern
 *
 * Coming in Iteration 3:
 * - Supabase (server-side)
 * - Hybrid mode with offline sync
 *
 * @example
 * ```typescript
 * // Key-value storage
 * import { createLocalStorage } from '@quizzme/storage';
 *
 * const storage = createLocalStorage({ prefix: 'quizzme:' });
 * await storage.set('user', { name: 'Alice', score: 100 });
 * const user = await storage.get<User>('user');
 *
 * // Profile storage
 * import { createProfileStorage } from '@quizzme/storage';
 *
 * const profileStorage = createProfileStorage({ mode: 'local' });
 * const profile = await profileStorage.getProfile('user-123');
 * ```
 */

// =============================================================================
// Core Types
// =============================================================================

export type { StorageProvider, StorageConfig } from './types.js';

// =============================================================================
// Key-Value Storage Implementations
// =============================================================================

// LocalStorage implementation
export { LocalStorageProvider, createLocalStorage } from './local-storage.js';

// Supabase placeholder (coming in Iteration 3)
export { SupabaseStorageProvider, createSupabaseStorage } from './supabase-storage.js';

// =============================================================================
// Profile Storage (Adapter Pattern)
// =============================================================================

export {
  // Factory
  createProfileStorage,

  // Implementations
  LocalProfileStorageProvider,
  createLocalProfileStorage,
  ApiProfileStorageProvider,
  createApiProfileStorage,
} from './profile/index.js';

export type {
  // Provider interface
  ProfileStorageProvider,
  ProfileStorageConfig,
  StorageMode,

  // Data types
  StoredProfile,
  StoredProfileSnapshot,
  StoredQuizResult,
  StoredTraitData,
  StoredTraitHistoryEntry,
  StoredSnapshotTrait,
  StoredTraitScore,
} from './profile/index.js';
