'use client';

import { useParams } from 'next/navigation';

import { QuizRunner } from '../../../../components/quiz/QuizRunner';
import { useProfile } from '../../../../lib/profile-context';
import type { MarkerWeight } from '../../../../lib/quizzes';
import { krafttierQuiz } from '../../../../lib/quizzes';

const QUIZZES: Record<string, typeof krafttierQuiz> = {
  'quiz.krafttier': krafttierQuiz,
};

export default function QuizPage() {
  const params = useParams();
  const { submitMarkers } = useProfile();

  const quizId = params.quizId as string;
  const quiz = QUIZZES[quizId];

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EE]">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Quiz nicht gefunden</p>
          <a href="/" className="text-indigo-600 hover:underline">
            Zurück zum Dashboard
          </a>
        </div>
      </div>
    );
  }

  const handleComplete = async (markers: MarkerWeight[], profileId: string) => {
    await submitMarkers(markers, quizId);
    console.log(`Quiz completed: ${quizId}, Profile: ${profileId}`);
  };

  return <QuizRunner quiz={quiz} onComplete={handleComplete} />;
}
