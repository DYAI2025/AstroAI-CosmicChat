'use client';

/**
 * Quiz Verticals Index Page
 * Displays all available quizzes for the user to take.
 */

import { QuizList } from '../../../components/Quiz';

export default function QuizIndexPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Entdecke dein Selbst</h1>
        <p className="text-gray-600 text-lg">
          Wähle einen Quiz und erfahre mehr über deine Persönlichkeit
        </p>
      </header>

      <QuizList />

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
