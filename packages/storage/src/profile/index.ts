/**
 * Profile Storage Module
 *
 * Provides profile-specific storage operations with support for
 * multiple backends (local, API, hybrid).
 *
 * @example
 * ```typescript
 * import { createProfileStorage } from '@quizzme/storage/profile';
 *
 * // Local storage (default)
 * const storage = createProfileStorage({ mode: 'local' });
 *
 * // API storage (requires auth)
 * const apiStorage = createProfileStorage({
 *   mode: 'api',
 *   apiBaseUrl: 'https://api.quizzme.com',
 *   getAuthToken: async () => getToken(),
 * });
 *
 * // Hybrid (local with API sync)
 * const hybridStorage = createProfileStorage({
 *   mode: 'hybrid',
 *   apiBaseUrl: 'https://api.quizzme.com',
 *   getAuthToken: async () => getToken(),
 *   offlineSupport: true,
 * });
 * ```
 */

// Types
export type {
  ProfileStorageProvider,
  ProfileStorageConfig,
  StorageMode,
  StoredProfile,
  StoredProfileSnapshot,
  StoredQuizResult,
  StoredTraitData,
  StoredTraitHistoryEntry,
  StoredSnapshotTrait,
  StoredTraitScore,
} from './types.js';

// Implementations
export {
  LocalProfileStorageProvider,
  createLocalProfileStorage,
} from './local-profile-storage.js';

export {
  ApiProfileStorageProvider,
  createApiProfileStorage,
} from './api-profile-storage.js';

// Factory
import type { ProfileStorageProvider, ProfileStorageConfig } from './types.js';
import { createLocalProfileStorage } from './local-profile-storage.js';
import { createApiProfileStorage } from './api-profile-storage.js';

/**
 * Create a profile storage provider based on configuration
 *
 * @param config - Storage configuration
 * @returns A profile storage provider instance
 */
export function createProfileStorage(
  config: ProfileStorageConfig = { mode: 'local' }
): ProfileStorageProvider {
  switch (config.mode) {
    case 'local':
      return createLocalProfileStorage(config);

    case 'api':
      return createApiProfileStorage(config);

    case 'hybrid':
      // TODO: Implement hybrid storage in Iteration 3
      // For now, fall back to local
      console.warn(
        '[ProfileStorage] Hybrid mode not yet implemented. Falling back to local storage.'
      );
      return createLocalProfileStorage(config);

    default:
      throw new Error(`Unknown storage mode: ${config.mode}`);
  }
}
