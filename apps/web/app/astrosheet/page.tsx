'use client';

/**
 * AstroSheet Dashboard Page
 * Displays the user's personalized psychological profile.
 */

import { AstroSheet } from '../../components/AstroSheet';

export default function AstroSheetPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Dein AstroSheet</h1>
        <p className="text-gray-600 text-lg">
          Dein persönliches Persönlichkeitsprofil auf einen Blick
        </p>
      </header>

      <AstroSheet />

      <div className="mt-12 text-center">
        <a
          href="/"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Zurück zur Startseite
        </a>
      </div>
    </div>
  );
}
