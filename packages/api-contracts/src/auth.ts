/**
 * Authentication Types
 *
 * Defines the contract for authentication across the application.
 */

// =============================================================================
// USER
// =============================================================================

/**
 * User profile information
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User email (optional for anonymous users) */
  email?: string;
  /** Display name */
  displayName?: string;
  /** Profile avatar URL */
  avatarUrl?: string;
  /** Whether the user is anonymous */
  isAnonymous: boolean;
  /** Account creation timestamp */
  createdAt: number;
  /** Last login timestamp */
  lastLoginAt: number;
}

/**
 * Anonymous user (localStorage-only mode)
 */
export interface AnonymousUser extends User {
  isAnonymous: true;
  email: undefined;
}

/**
 * Authenticated user (with email/password or OAuth)
 */
export interface AuthenticatedUser extends User {
  isAnonymous: false;
  email: string;
}

// =============================================================================
// AUTH STATE
// =============================================================================

/**
 * Authentication state
 */
export type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated'; user: null }
  | { status: 'anonymous'; user: AnonymousUser }
  | { status: 'authenticated'; user: AuthenticatedUser };

/**
 * Auth provider type
 */
export type AuthProvider = 'anonymous' | 'email' | 'google' | 'github';

// =============================================================================
// AUTH OPERATIONS
// =============================================================================

/**
 * Sign up request
 */
export interface SignUpRequest {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Sign in request
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * OAuth sign in request
 */
export interface OAuthSignInRequest {
  provider: 'google' | 'github';
  redirectUrl?: string;
}

/**
 * Auth result (for sign in/sign up operations)
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
}

/**
 * Auth error
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

/**
 * Auth error codes
 */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_in_use'
  | 'weak_password'
  | 'user_not_found'
  | 'email_not_verified'
  | 'too_many_requests'
  | 'network_error'
  | 'unknown_error';

// =============================================================================
// AUTH SERVICE INTERFACE
// =============================================================================

/**
 * Authentication service interface
 *
 * Implementations can be:
 * - Local (anonymous mode, localStorage-based)
 * - Supabase (server-side auth)
 * - Other providers
 */
export interface AuthService {
  /**
   * Get current auth state
   */
  getState(): AuthState;

  /**
   * Subscribe to auth state changes
   */
  onStateChange(callback: (state: AuthState) => void): () => void;

  /**
   * Sign in with email and password
   */
  signInWithEmail(request: SignInRequest): Promise<AuthResult>;

  /**
   * Sign up with email and password
   */
  signUpWithEmail(request: SignUpRequest): Promise<AuthResult>;

  /**
   * Sign in with OAuth provider
   */
  signInWithOAuth(request: OAuthSignInRequest): Promise<AuthResult>;

  /**
   * Continue as anonymous user
   */
  continueAsAnonymous(): Promise<AuthResult>;

  /**
   * Convert anonymous user to authenticated
   */
  linkAnonymousToEmail(request: SignUpRequest): Promise<AuthResult>;

  /**
   * Sign out
   */
  signOut(): Promise<void>;
}
