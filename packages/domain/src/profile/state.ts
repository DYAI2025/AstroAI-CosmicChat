/**
 * Profile State Management
 * Immutable state management for psychological profiles
 */

import type {
  PsychologicalProfile,
  TraitHistory,
  TraitHistoryEntry,
} from '../trait-engine/types';

/**
 * Serializable version of PsychologicalProfile for persistence
 */
export interface SerializedProfile {
  profileId: string;
  userId: string;
  traits: SerializedTraitHistory[];
  createdAt: number;
  updatedAt: number;
  version: number;
}

/**
 * Serializable version of TraitHistory
 */
export interface SerializedTraitHistory {
  traitId: string;
  currentScore: number;
  currentConfidence: number;
  history: TraitHistoryEntry[];
}

/**
 * Serialize a PsychologicalProfile for storage/transmission
 * Converts Map to array for JSON compatibility
 */
export function serializeProfile(profile: PsychologicalProfile): SerializedProfile {
  const serializedTraits: SerializedTraitHistory[] = [];

  for (const [traitId, history] of profile.traits.entries()) {
    serializedTraits.push({
      traitId,
      currentScore: history.currentScore,
      currentConfidence: history.currentConfidence,
      history: [...history.history],
    });
  }

  return {
    profileId: profile.profileId,
    userId: profile.userId,
    traits: serializedTraits,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    version: profile.version,
  };
}

/**
 * Deserialize a stored profile back to runtime format
 * Converts array back to Map
 */
export function deserializeProfile(data: SerializedProfile): PsychologicalProfile {
  const traits = new Map<string, TraitHistory>();

  for (const serialized of data.traits) {
    traits.set(serialized.traitId, {
      traitId: serialized.traitId,
      currentScore: serialized.currentScore,
      currentConfidence: serialized.currentConfidence,
      history: serialized.history,
    });
  }

  return {
    profileId: data.profileId,
    userId: data.userId,
    traits,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    version: data.version,
  };
}

/**
 * Create a deep clone of a profile (immutable copy)
 */
export function cloneProfile(profile: PsychologicalProfile): PsychologicalProfile {
  const clonedTraits = new Map<string, TraitHistory>();

  for (const [traitId, history] of profile.traits.entries()) {
    clonedTraits.set(traitId, {
      traitId: history.traitId,
      currentScore: history.currentScore,
      currentConfidence: history.currentConfidence,
      history: history.history.map((entry) => ({ ...entry })),
    });
  }

  return {
    ...profile,
    traits: clonedTraits,
  };
}

/**
 * Check if two profiles are equal (deep comparison)
 */
export function profilesEqual(a: PsychologicalProfile, b: PsychologicalProfile): boolean {
  if (a.profileId !== b.profileId) return false;
  if (a.userId !== b.userId) return false;
  if (a.version !== b.version) return false;
  if (a.traits.size !== b.traits.size) return false;

  for (const [traitId, historyA] of a.traits.entries()) {
    const historyB = b.traits.get(traitId);
    if (!historyB) return false;

    if (historyA.currentScore !== historyB.currentScore) return false;
    if (historyA.currentConfidence !== historyB.currentConfidence) return false;
    if (historyA.history.length !== historyB.history.length) return false;

    for (let i = 0; i < historyA.history.length; i++) {
      const entryA = historyA.history[i];
      const entryB = historyB.history[i];
      if (!entryA || !entryB) return false;
      if (entryA.score !== entryB.score) return false;
      if (entryA.confidence !== entryB.confidence) return false;
      if (entryA.timestamp !== entryB.timestamp) return false;
      if (entryA.sourceQuizId !== entryB.sourceQuizId) return false;
    }
  }

  return true;
}

/**
 * Merge two profiles (for conflict resolution)
 * Uses "last writer wins" strategy based on version
 */
export function mergeProfiles(
  local: PsychologicalProfile,
  remote: PsychologicalProfile
): PsychologicalProfile {
  // If versions are the same, prefer remote (server wins)
  if (local.version <= remote.version) {
    return cloneProfile(remote);
  }

  // If local is newer, merge trait histories
  const mergedTraits = new Map<string, TraitHistory>();

  // Start with remote traits
  for (const [traitId, remoteHistory] of remote.traits.entries()) {
    mergedTraits.set(traitId, {
      ...remoteHistory,
      history: [...remoteHistory.history],
    });
  }

  // Merge in local traits
  for (const [traitId, localHistory] of local.traits.entries()) {
    const existing = mergedTraits.get(traitId);

    if (!existing) {
      mergedTraits.set(traitId, {
        ...localHistory,
        history: [...localHistory.history],
      });
    } else {
      // Merge histories by combining unique entries
      const mergedHistory = mergeHistories(existing.history, localHistory.history);
      const lastEntry = mergedHistory[mergedHistory.length - 1];

      mergedTraits.set(traitId, {
        traitId,
        currentScore: lastEntry?.score ?? localHistory.currentScore,
        currentConfidence: lastEntry?.confidence ?? localHistory.currentConfidence,
        history: mergedHistory,
      });
    }
  }

  return {
    profileId: local.profileId,
    userId: local.userId,
    traits: mergedTraits,
    createdAt: Math.min(local.createdAt, remote.createdAt),
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
    version: Math.max(local.version, remote.version) + 1,
  };
}

/**
 * Merge two history arrays, removing duplicates by timestamp
 */
function mergeHistories(
  a: TraitHistoryEntry[],
  b: TraitHistoryEntry[]
): TraitHistoryEntry[] {
  const seen = new Set<string>();
  const merged: TraitHistoryEntry[] = [];

  const all = [...a, ...b].sort((x, y) => x.timestamp - y.timestamp);

  for (const entry of all) {
    const key = `${entry.timestamp}-${entry.sourceQuizId}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(entry);
    }
  }

  return merged;
}

/**
 * Get trait score from profile, with optional default
 */
export function getTraitScore(
  profile: PsychologicalProfile,
  traitId: string,
  defaultValue: number = 0
): number {
  const history = profile.traits.get(traitId);
  return history?.currentScore ?? defaultValue;
}

/**
 * Get trait confidence from profile
 */
export function getTraitConfidence(
  profile: PsychologicalProfile,
  traitId: string
): number {
  const history = profile.traits.get(traitId);
  return history?.currentConfidence ?? 0;
}

/**
 * Check if profile has meaningful data for a trait
 */
export function hasTraitData(
  profile: PsychologicalProfile,
  traitId: string,
  minConfidence: number = 0.1
): boolean {
  const history = profile.traits.get(traitId);
  if (!history) return false;
  return history.currentConfidence >= minConfidence && history.history.length > 0;
}

/**
 * Get all trait IDs that have data in the profile
 */
export function getPopulatedTraitIds(
  profile: PsychologicalProfile,
  minConfidence: number = 0.1
): string[] {
  const populated: string[] = [];

  for (const [traitId, history] of profile.traits.entries()) {
    if (history.currentConfidence >= minConfidence && history.history.length > 0) {
      populated.push(traitId);
    }
  }

  return populated;
}

/**
 * Calculate the age of the most recent update for a trait
 */
export function getTraitAge(
  profile: PsychologicalProfile,
  traitId: string
): number | null {
  const history = profile.traits.get(traitId);
  if (!history || history.history.length === 0) return null;

  const lastEntry = history.history[history.history.length - 1];
  if (!lastEntry) return null;

  return Date.now() - lastEntry.timestamp;
}

/**
 * Prune old history entries from profile
 */
export function pruneProfileHistory(
  profile: PsychologicalProfile,
  maxEntriesPerTrait: number,
  maxAgeMs?: number
): PsychologicalProfile {
  const now = Date.now();
  const prunedTraits = new Map<string, TraitHistory>();

  for (const [traitId, history] of profile.traits.entries()) {
    let prunedHistory = [...history.history];

    // Remove old entries if maxAge specified
    if (maxAgeMs !== undefined) {
      prunedHistory = prunedHistory.filter(
        (entry) => now - entry.timestamp <= maxAgeMs
      );
    }

    // Keep only the most recent entries
    prunedHistory = prunedHistory.slice(-maxEntriesPerTrait);

    const lastEntry = prunedHistory[prunedHistory.length - 1];

    prunedTraits.set(traitId, {
      traitId,
      currentScore: lastEntry?.score ?? history.currentScore,
      currentConfidence: lastEntry?.confidence ?? history.currentConfidence,
      history: prunedHistory,
    });
  }

  return {
    ...profile,
    traits: prunedTraits,
    updatedAt: now,
    version: profile.version + 1,
  };
}
