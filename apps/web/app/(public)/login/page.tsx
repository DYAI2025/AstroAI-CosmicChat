'use client';

/**
 * Login Page
 *
 * Provides options for authentication:
 * - Continue as anonymous (localStorage-only)
 * - Sign in with email (coming in future iteration)
 * - OAuth providers (coming in future iteration)
 */

import { useEffect, useState } from 'react';

import { useAuth } from '../../../lib/auth-context';

export default function LoginPage() {
  const { isAuthenticated, isLoading, continueAsAnonymous } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = '/';
    }
  }, [isLoading, isAuthenticated]);

  const handleContinueAnonymous = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await continueAsAnonymous();
      if (result.success) {
        window.location.href = '/';
      } else {
        setError(result.error?.message ?? 'Ein Fehler ist aufgetreten');
      }
    } catch {
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Willkommen bei QuizzMe</h1>
          <p className="text-gray-600">
            Entdecke dein kosmisches Selbst
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Auth Options */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Anonymous Mode - Primary Option */}
          <div>
            <button
              onClick={handleContinueAnonymous}
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium text-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Wird geladen...
                </span>
              ) : (
                'Anonym starten'
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Deine Daten werden lokal gespeichert
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">
                oder
              </span>
            </div>
          </div>

          {/* Email Auth - Coming Soon */}
          <div className="space-y-3">
            <button
              disabled
              className="w-full py-3 px-6 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed border-2 border-dashed border-gray-200"
            >
              Mit E-Mail anmelden
              <span className="block text-xs mt-1">Demnächst verfügbar</span>
            </button>

            {/* OAuth Providers - Coming Soon */}
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled
                className="py-3 px-4 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed border-2 border-dashed border-gray-200 text-sm"
              >
                Google
              </button>
              <button
                disabled
                className="py-3 px-4 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed border-2 border-dashed border-gray-200 text-sm"
              >
                GitHub
              </button>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">
            Im anonymen Modus werden deine Daten nur auf diesem Gerät gespeichert.
          </p>
          <p>
            Du kannst später ein Konto erstellen, um deine Daten zu synchronisieren.
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}
