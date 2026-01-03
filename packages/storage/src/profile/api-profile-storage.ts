/**
 * API Profile Storage Provider
 *
 * Implements profile storage using a backend API.
 * This is a placeholder for Iteration 3 when auth is implemented.
 */

import type {
  ProfileStorageProvider,
  ProfileStorageConfig,
  StoredProfile,
  StoredProfileSnapshot,
  StoredQuizResult,
} from './types.js';

/**
 * API-based Profile Storage Provider
 *
 * Will communicate with Supabase or other backend in Iteration 3.
 */
export class ApiProfileStorageProvider implements ProfileStorageProvider {
  private getAuthToken: () => Promise<string | null>;

  constructor(config: ProfileStorageConfig) {
    if (config.mode !== 'api' && config.mode !== 'hybrid') {
      throw new Error('ApiProfileStorageProvider requires mode "api" or "hybrid"');
    }

    this.getAuthToken = config.getAuthToken ?? (() => Promise.resolve(null));
  }

  /**
   * Get a profile by user ID
   */
  async getProfile(_userId: string): Promise<StoredProfile | null> {
    // TODO: Implement in Iteration 3
    throw new Error(
      'API storage not yet implemented. Will be available in Iteration 3 with authentication.'
    );
  }

  /**
   * Save a profile
   */
  async saveProfile(_profile: StoredProfile): Promise<StoredProfile> {
    // TODO: Implement in Iteration 3
    throw new Error(
      'API storage not yet implemented. Will be available in Iteration 3 with authentication.'
    );
  }

  /**
   * Delete a profile
   */
  async deleteProfile(_userId: string): Promise<void> {
    // TODO: Implement in Iteration 3
    throw new Error(
      'API storage not yet implemented. Will be available in Iteration 3 with authentication.'
    );
  }

  /**
   * Get the latest snapshot for a user
   */
  async getLatestSnapshot(_userId: string): Promise<StoredProfileSnapshot | null> {
    // TODO: Implement in Iteration 3
    throw new Error(
      'API storage not yet implemented. Will be available in Iteration 3 with authentication.'
    );
  }

  /**
   * Save a quiz result
   */
  async saveQuizResult(_result: StoredQuizResult): Promise<void> {
    // TODO: Implement in Iteration 3
    throw new Error(
      'API storage not yet implemented. Will be available in Iteration 3 with authentication.'
    );
  }

  /**
   * Get quiz history for a user
   */
  async getQuizHistory(_userId: string, _limit?: number): Promise<StoredQuizResult[]> {
    // TODO: Implement in Iteration 3
    throw new Error(
      'API storage not yet implemented. Will be available in Iteration 3 with authentication.'
    );
  }

  /**
   * Check if storage is available (requires auth)
   */
  async isAvailable(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return token !== null;
    } catch {
      return false;
    }
  }

  /**
   * Sync with server (no-op for pure API mode)
   */
  async sync(): Promise<boolean> {
    // In pure API mode, everything is already synced
    return true;
  }
}

/**
 * Create an API profile storage provider
 */
export function createApiProfileStorage(
  config: ProfileStorageConfig
): ProfileStorageProvider {
  return new ApiProfileStorageProvider(config);
}
