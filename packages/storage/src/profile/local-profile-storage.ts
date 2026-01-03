/**
 * Local Profile Storage Provider
 *
 * Implements profile storage using browser localStorage.
 * Provides full offline capability with SSR fallback.
 */

import type { StorageProvider } from '../types.js';
import { LocalStorageProvider } from '../local-storage.js';
import type {
  ProfileStorageProvider,
  ProfileStorageConfig,
  StoredProfile,
  StoredProfileSnapshot,
  StoredQuizResult,
} from './types.js';

// Storage keys
const PROFILE_KEY = 'profile';
const SNAPSHOT_KEY = 'snapshot';
const QUIZ_HISTORY_KEY = 'quiz_history';

/**
 * LocalStorage-based Profile Storage Provider
 */
export class LocalProfileStorageProvider implements ProfileStorageProvider {
  private storage: StorageProvider;
  private prefix: string;

  constructor(config: ProfileStorageConfig = { mode: 'local' }) {
    this.prefix = config.prefix ?? 'quizzme_';
    this.storage = new LocalStorageProvider({ prefix: this.prefix });
  }

  /**
   * Get the storage key for a user's data
   */
  private getUserKey(userId: string, key: string): string {
    return `${userId}_${key}`;
  }

  /**
   * Get a profile by user ID
   */
  async getProfile(userId: string): Promise<StoredProfile | null> {
    const key = this.getUserKey(userId, PROFILE_KEY);
    return this.storage.get<StoredProfile>(key);
  }

  /**
   * Save a profile
   */
  async saveProfile(profile: StoredProfile): Promise<StoredProfile> {
    const key = this.getUserKey(profile.userId, PROFILE_KEY);

    // Update version and timestamp
    const updatedProfile: StoredProfile = {
      ...profile,
      version: profile.version + 1,
      updatedAt: Date.now(),
    };

    await this.storage.set(key, updatedProfile);

    // Also update the snapshot
    await this.updateSnapshot(updatedProfile);

    return updatedProfile;
  }

  /**
   * Delete a profile
   */
  async deleteProfile(userId: string): Promise<void> {
    const profileKey = this.getUserKey(userId, PROFILE_KEY);
    const snapshotKey = this.getUserKey(userId, SNAPSHOT_KEY);
    const historyKey = this.getUserKey(userId, QUIZ_HISTORY_KEY);

    await Promise.all([
      this.storage.delete(profileKey),
      this.storage.delete(snapshotKey),
      this.storage.delete(historyKey),
    ]);
  }

  /**
   * Get the latest snapshot for a user
   */
  async getLatestSnapshot(userId: string): Promise<StoredProfileSnapshot | null> {
    const key = this.getUserKey(userId, SNAPSHOT_KEY);
    return this.storage.get<StoredProfileSnapshot>(key);
  }

  /**
   * Update the snapshot from a profile
   */
  private async updateSnapshot(profile: StoredProfile): Promise<void> {
    const key = this.getUserKey(profile.userId, SNAPSHOT_KEY);

    const snapshot: StoredProfileSnapshot = {
      snapshotId: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      profileId: profile.profileId,
      timestamp: Date.now(),
      traits: profile.traits.map((t) => ({
        traitId: t.traitId,
        aggregatedScore: t.aggregatedScore,
        confidence: t.confidence,
        dataPoints: t.dataPoints,
      })),
      completeness: this.calculateCompleteness(profile),
      contributingQuizIds: profile.contributingQuizIds,
    };

    await this.storage.set(key, snapshot);
  }

  /**
   * Calculate profile completeness (0-1)
   */
  private calculateCompleteness(profile: StoredProfile): number {
    if (profile.traits.length === 0) {
      return 0;
    }

    // Average confidence across all traits
    const totalConfidence = profile.traits.reduce((sum, t) => sum + t.confidence, 0);
    return totalConfidence / profile.traits.length;
  }

  /**
   * Save a quiz result
   */
  async saveQuizResult(result: StoredQuizResult): Promise<void> {
    const key = this.getUserKey(result.userId, QUIZ_HISTORY_KEY);
    const history = (await this.storage.get<StoredQuizResult[]>(key)) ?? [];

    // Add new result to the beginning
    history.unshift(result);

    // Keep only last 100 results
    const trimmedHistory = history.slice(0, 100);

    await this.storage.set(key, trimmedHistory);
  }

  /**
   * Get quiz history for a user
   */
  async getQuizHistory(userId: string, limit = 20): Promise<StoredQuizResult[]> {
    const key = this.getUserKey(userId, QUIZ_HISTORY_KEY);
    const history = (await this.storage.get<StoredQuizResult[]>(key)) ?? [];
    return history.slice(0, limit);
  }

  /**
   * Check if storage is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const testKey = '__profile_storage_test__';
      await this.storage.set(testKey, { test: true });
      await this.storage.delete(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create a local profile storage provider
 */
export function createLocalProfileStorage(
  config?: Partial<ProfileStorageConfig>
): ProfileStorageProvider {
  return new LocalProfileStorageProvider({
    mode: 'local',
    ...config,
  });
}
