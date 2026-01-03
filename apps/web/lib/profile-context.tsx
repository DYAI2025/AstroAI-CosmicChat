'use client';

/**
 * Profile Context - Client-side profile state management
 * Provides access to the user's psychological profile across the app
 */

import type {
  ProfileSnapshot,
  PsychologicalProfile,
  QuizAnswer,
  QuizDefinition,
  SerializedProfile,
  TraitDefinition,
  TraitScore,
} from '@quizzme/domain';
import {
  deserializeProfile,
  initializeRegistry,
  InMemoryQuizRegistry,
  serializeProfile,
  TraitEngine,
} from '@quizzme/domain';
import { createLocalStorage } from '@quizzme/storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Storage keys
const PROFILE_STORAGE_KEY = 'quizzme_profile';
const USER_ID_STORAGE_KEY = 'quizzme_user_id';

// Initialize registry with predefined data
const registry = new InMemoryQuizRegistry();
initializeRegistry(registry);

// Create trait engine
const engine = new TraitEngine({ registry });

// Create storage
const storage = createLocalStorage({ prefix: 'quizzme_' });

/**
 * Profile context state
 */
interface ProfileContextState {
  /** Current user profile */
  profile: PsychologicalProfile | null;
  /** Current profile snapshot */
  snapshot: ProfileSnapshot | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: string | null;
  /** Whether profile has been initialized */
  isInitialized: boolean;
}

/**
 * Profile context actions
 */
interface ProfileContextActions {
  /** Submit quiz answers and update profile */
  submitQuizAnswers: (answers: QuizAnswer[]) => Promise<TraitScore[]>;
  /** Get a quiz definition by ID */
  getQuiz: (quizId: string) => QuizDefinition | undefined;
  /** Get all available quizzes */
  getAllQuizzes: () => QuizDefinition[];
  /** Get a trait definition by ID */
  getTrait: (traitId: string) => TraitDefinition | undefined;
  /** Get all trait definitions */
  getAllTraits: () => TraitDefinition[];
  /** Refresh snapshot */
  refreshSnapshot: () => void;
  /** Reset profile */
  resetProfile: () => Promise<void>;
}

type ProfileContextValue = ProfileContextState & ProfileContextActions;

const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Generate a simple user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Profile Provider component
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfileContextState>({
    profile: null,
    snapshot: null,
    isLoading: true,
    error: null,
    isInitialized: false,
  });

  // Initialize profile on mount
  useEffect(() => {
    async function initProfile() {
      try {
        // Try to load existing profile
        const savedProfile = await storage.get<SerializedProfile>(PROFILE_STORAGE_KEY);
        let userId = await storage.get<string>(USER_ID_STORAGE_KEY);

        if (!userId) {
          userId = generateUserId();
          await storage.set(USER_ID_STORAGE_KEY, userId);
        }

        let profile: PsychologicalProfile;

        if (savedProfile) {
          // Deserialize existing profile
          profile = deserializeProfile(savedProfile);
        } else {
          // Create new profile
          profile = engine.createProfile(userId);
          // Save immediately
          await storage.set(PROFILE_STORAGE_KEY, serializeProfile(profile));
        }

        // Create initial snapshot
        const snapshot = engine.getSnapshot(profile);

        setState({
          profile,
          snapshot,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      } catch (err) {
        console.error('Failed to initialize profile:', err);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load profile',
          isInitialized: true,
        }));
      }
    }

    initProfile();
  }, []);

  // Submit quiz answers
  const submitQuizAnswers = useCallback(
    async (answers: QuizAnswer[]): Promise<TraitScore[]> => {
      if (!state.profile) {
        throw new Error('Profile not initialized');
      }

      // Validate answers
      const validation = engine.validateAnswers(answers);
      if (!validation.success) {
        throw new Error(validation.error ?? 'Invalid answers');
      }

      // Process answers to get trait scores
      const scores = engine.processAnswers(answers);

      // Update profile
      const updatedProfile = engine.updateProfile(state.profile, scores);

      // Save to storage
      await storage.set(PROFILE_STORAGE_KEY, serializeProfile(updatedProfile));

      // Update snapshot
      const newSnapshot = engine.getSnapshot(updatedProfile);

      // Update state
      setState((prev) => ({
        ...prev,
        profile: updatedProfile,
        snapshot: newSnapshot,
      }));

      return scores;
    },
    [state.profile]
  );

  // Get quiz by ID
  const getQuiz = useCallback((quizId: string) => {
    return registry.getQuiz(quizId);
  }, []);

  // Get all quizzes
  const getAllQuizzes = useCallback(() => {
    return registry.getAllQuizzes();
  }, []);

  // Get trait by ID
  const getTrait = useCallback((traitId: string) => {
    return registry.getTrait(traitId);
  }, []);

  // Get all traits
  const getAllTraits = useCallback(() => {
    return registry.getAllTraits();
  }, []);

  // Refresh snapshot
  const refreshSnapshot = useCallback(() => {
    if (state.profile) {
      const newSnapshot = engine.getSnapshot(state.profile);
      setState((prev) => ({ ...prev, snapshot: newSnapshot }));
    }
  }, [state.profile]);

  // Reset profile
  const resetProfile = useCallback(async () => {
    let userId = await storage.get<string>(USER_ID_STORAGE_KEY);
    if (!userId) {
      userId = generateUserId();
      await storage.set(USER_ID_STORAGE_KEY, userId);
    }

    const newProfile = engine.createProfile(userId);
    await storage.set(PROFILE_STORAGE_KEY, serializeProfile(newProfile));
    const newSnapshot = engine.getSnapshot(newProfile);

    setState((prev) => ({
      ...prev,
      profile: newProfile,
      snapshot: newSnapshot,
    }));
  }, []);

  const contextValue: ProfileContextValue = {
    ...state,
    submitQuizAnswers,
    getQuiz,
    getAllQuizzes,
    getTrait,
    getAllTraits,
    refreshSnapshot,
    resetProfile,
  };

  return (
    <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
  );
}

/**
 * Hook to access profile context
 */
export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

/**
 * Hook to get a specific trait score from the snapshot
 */
export function useTraitScore(traitId: string): {
  score: number;
  confidence: number;
  label: string;
} | null {
  const { snapshot, getTrait } = useProfile();

  if (!snapshot) return null;

  const traitData = snapshot.traits.find((t) => t.traitId === traitId);
  const traitDef = getTrait(traitId);

  if (!traitData) return null;

  return {
    score: traitData.aggregatedScore,
    confidence: traitData.confidence,
    label: traitDef?.name ?? traitId,
  };
}
