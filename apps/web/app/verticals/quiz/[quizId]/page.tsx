'use client';

/**
 * Individual Quiz Page
 * Displays and handles a specific quiz based on the quizId parameter.
 */

import { Quiz } from '../../../../components/Quiz';

interface QuizPageProps {
  params: {
    quizId: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <a
          href="/verticals/quiz"
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          ← Alle Quizzes
        </a>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <Quiz quizId={params.quizId} />
      </div>
    </div>
  );
}
