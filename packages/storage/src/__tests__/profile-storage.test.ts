/**
 * Profile Storage Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createProfileStorage,
  createLocalProfileStorage,
  LocalProfileStorageProvider,
  type StoredProfile,
  type StoredQuizResult,
} from '../index.js';

// Mock localStorage
const mockStorage = new Map<string, string>();

const mockLocalStorage = {
  getItem: vi.fn((key: string) => mockStorage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => mockStorage.set(key, value)),
  removeItem: vi.fn((key: string) => mockStorage.delete(key)),
  clear: vi.fn(() => mockStorage.clear()),
  key: vi.fn((index: number) => Array.from(mockStorage.keys())[index] ?? null),
  get length() {
    return mockStorage.size;
  },
};

// Mock window.localStorage
vi.stubGlobal('window', { localStorage: mockLocalStorage });

describe('LocalProfileStorageProvider', () => {
  let storage: LocalProfileStorageProvider;

  const createTestProfile = (userId: string): StoredProfile => ({
    profileId: `profile_${userId}`,
    userId,
    version: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    traits: [
      {
        traitId: 'openness',
        aggregatedScore: 0.75,
        confidence: 0.8,
        dataPoints: 5,
        lastUpdated: Date.now(),
        history: [
          {
            score: 0.7,
            confidence: 0.6,
            timestamp: Date.now() - 1000,
            sourceQuizId: 'quiz-1',
          },
        ],
      },
    ],
    contributingQuizIds: ['quiz-1'],
  });

  const createTestQuizResult = (userId: string, quizId: string): StoredQuizResult => ({
    quizId,
    userId,
    completedAt: Date.now(),
    traitScores: [
      {
        traitId: 'openness',
        score: 0.8,
        confidence: 0.9,
        questionCount: 5,
      },
    ],
  });

  beforeEach(() => {
    mockStorage.clear();
    vi.clearAllMocks();
    storage = new LocalProfileStorageProvider({ mode: 'local', prefix: 'test_' });
  });

  describe('getProfile / saveProfile', () => {
    it('should return null for non-existent profile', async () => {
      const profile = await storage.getProfile('user-123');
      expect(profile).toBeNull();
    });

    it('should save and retrieve a profile', async () => {
      const testProfile = createTestProfile('user-123');
      const savedProfile = await storage.saveProfile(testProfile);

      // Version should be incremented
      expect(savedProfile.version).toBe(1);
      expect(savedProfile.updatedAt).toBeGreaterThanOrEqual(testProfile.updatedAt);

      // Should be retrievable
      const retrievedProfile = await storage.getProfile('user-123');
      expect(retrievedProfile).not.toBeNull();
      expect(retrievedProfile?.userId).toBe('user-123');
      expect(retrievedProfile?.traits.length).toBe(1);
    });

    it('should increment version on each save', async () => {
      const testProfile = createTestProfile('user-456');

      const save1 = await storage.saveProfile(testProfile);
      expect(save1.version).toBe(1);

      const save2 = await storage.saveProfile(save1);
      expect(save2.version).toBe(2);

      const save3 = await storage.saveProfile(save2);
      expect(save3.version).toBe(3);
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile and its associated data', async () => {
      const testProfile = createTestProfile('user-delete');
      await storage.saveProfile(testProfile);

      // Verify it exists
      let profile = await storage.getProfile('user-delete');
      expect(profile).not.toBeNull();

      // Delete it
      await storage.deleteProfile('user-delete');

      // Verify it's gone
      profile = await storage.getProfile('user-delete');
      expect(profile).toBeNull();

      // Snapshot should also be gone
      const snapshot = await storage.getLatestSnapshot('user-delete');
      expect(snapshot).toBeNull();
    });
  });

  describe('getLatestSnapshot', () => {
    it('should return null if no snapshot exists', async () => {
      const snapshot = await storage.getLatestSnapshot('user-none');
      expect(snapshot).toBeNull();
    });

    it('should create snapshot when saving profile', async () => {
      const testProfile = createTestProfile('user-snap');
      await storage.saveProfile(testProfile);

      const snapshot = await storage.getLatestSnapshot('user-snap');
      expect(snapshot).not.toBeNull();
      expect(snapshot?.profileId).toBe('profile_user-snap');
      expect(snapshot?.traits.length).toBe(1);
      expect(snapshot?.traits[0].aggregatedScore).toBe(0.75);
    });
  });

  describe('quiz history', () => {
    it('should save and retrieve quiz results', async () => {
      const result1 = createTestQuizResult('user-quiz', 'quiz-1');
      const result2 = createTestQuizResult('user-quiz', 'quiz-2');

      await storage.saveQuizResult(result1);
      await storage.saveQuizResult(result2);

      const history = await storage.getQuizHistory('user-quiz');
      expect(history.length).toBe(2);
      // Most recent first
      expect(history[0].quizId).toBe('quiz-2');
      expect(history[1].quizId).toBe('quiz-1');
    });

    it('should limit history retrieval', async () => {
      // Save 5 results
      for (let i = 0; i < 5; i++) {
        await storage.saveQuizResult(createTestQuizResult('user-limit', `quiz-${i}`));
      }

      const limitedHistory = await storage.getQuizHistory('user-limit', 3);
      expect(limitedHistory.length).toBe(3);
    });
  });

  describe('isAvailable', () => {
    it('should return true when storage is available', async () => {
      const available = await storage.isAvailable();
      expect(available).toBe(true);
    });
  });
});

describe('createProfileStorage factory', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('should create local storage by default', () => {
    const storage = createProfileStorage();
    expect(storage).toBeInstanceOf(LocalProfileStorageProvider);
  });

  it('should create local storage when mode is "local"', () => {
    const storage = createProfileStorage({ mode: 'local' });
    expect(storage).toBeInstanceOf(LocalProfileStorageProvider);
  });

  it('should throw for invalid mode', () => {
    expect(() => createProfileStorage({ mode: 'invalid' as any })).toThrow();
  });
});

describe('createLocalProfileStorage', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('should create a local profile storage provider', () => {
    const storage = createLocalProfileStorage();
    expect(storage).toBeInstanceOf(LocalProfileStorageProvider);
  });

  it('should use custom prefix', async () => {
    const storage = createLocalProfileStorage({ prefix: 'custom_' });
    const testProfile: StoredProfile = {
      profileId: 'test',
      userId: 'user-prefix',
      version: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      traits: [],
      contributingQuizIds: [],
    };

    await storage.saveProfile(testProfile);

    // Check that the key was prefixed
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const setItemCalls = mockLocalStorage.setItem.mock.calls;
    const hasCustomPrefix = setItemCalls.some((call: [string, string]) =>
      call[0].startsWith('custom_')
    );
    expect(hasCustomPrefix).toBe(true);
  });
});
