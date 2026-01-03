'use client';

/**
 * Auth Context - Client-side authentication state management
 *
 * Provides authentication state and operations across the app.
 * Currently implements anonymous/local-only mode.
 * Will support Supabase auth in future iterations.
 */

import type {
  AuthState,
  AuthResult,
  AnonymousUser,
  User,
} from '@quizzme/api-contracts';
import { createLocalStorage } from '@quizzme/storage';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

const AUTH_STORAGE_KEY = 'auth_user';

// =============================================================================
// LOCAL AUTH SERVICE
// =============================================================================

/**
 * Generate a unique anonymous user ID
 */
function generateAnonymousUserId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Create an anonymous user
 */
function createAnonymousUser(): AnonymousUser {
  const now = Date.now();
  return {
    id: generateAnonymousUserId(),
    isAnonymous: true,
    email: undefined,
    displayName: 'Anonymer Nutzer',
    avatarUrl: undefined,
    createdAt: now,
    lastLoginAt: now,
  };
}

// =============================================================================
// CONTEXT
// =============================================================================

interface AuthContextValue {
  /** Current auth state */
  state: AuthState;
  /** Current user (convenience accessor) */
  user: User | null;
  /** Whether auth is loading */
  isLoading: boolean;
  /** Whether user is authenticated (including anonymous) */
  isAuthenticated: boolean;
  /** Whether user is anonymous */
  isAnonymous: boolean;
  /** Continue as anonymous user */
  continueAsAnonymous: () => Promise<AuthResult>;
  /** Sign out */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [storage] = useState(() => createLocalStorage({ prefix: 'quizzme_' }));

  // Load auth state from storage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = await storage.get<User>(AUTH_STORAGE_KEY);

        if (storedUser) {
          // Update last login time
          const updatedUser: User = {
            ...storedUser,
            lastLoginAt: Date.now(),
          };
          await storage.set(AUTH_STORAGE_KEY, updatedUser);

          if (updatedUser.isAnonymous) {
            setState({
              status: 'anonymous',
              user: updatedUser as AnonymousUser,
            });
          } else {
            setState({
              status: 'authenticated',
              user: updatedUser as User & { isAnonymous: false; email: string },
            });
          }
        } else {
          setState({ status: 'unauthenticated', user: null });
        }
      } catch (error) {
        console.error('[Auth] Failed to load auth state:', error);
        setState({ status: 'unauthenticated', user: null });
      }
    };

    loadAuth();
  }, [storage]);

  /**
   * Continue as anonymous user
   */
  const continueAsAnonymous = useCallback(async (): Promise<AuthResult> => {
    try {
      const anonymousUser = createAnonymousUser();
      await storage.set(AUTH_STORAGE_KEY, anonymousUser);

      setState({
        status: 'anonymous',
        user: anonymousUser,
      });

      return { success: true, user: anonymousUser };
    } catch (error) {
      console.error('[Auth] Failed to create anonymous user:', error);
      return {
        success: false,
        error: {
          code: 'unknown_error',
          message: 'Failed to create anonymous user',
        },
      };
    }
  }, [storage]);

  /**
   * Sign out
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await storage.delete(AUTH_STORAGE_KEY);
      setState({ status: 'unauthenticated', user: null });
    } catch (error) {
      console.error('[Auth] Failed to sign out:', error);
    }
  }, [storage]);

  // Compute derived values
  const user = state.status === 'anonymous' || state.status === 'authenticated'
    ? state.user
    : null;
  const isLoading = state.status === 'loading';
  const isAuthenticated = state.status === 'anonymous' || state.status === 'authenticated';
  const isAnonymous = state.status === 'anonymous';

  const value: AuthContextValue = {
    state,
    user,
    isLoading,
    isAuthenticated,
    isAnonymous,
    continueAsAnonymous,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Use auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Use current user
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Use require auth - redirects to login if not authenticated
 */
export function useRequireAuth(): User {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login';
    }
  }, [isLoading, isAuthenticated]);

  if (!user) {
    throw new Error('User is required');
  }

  return user;
}
