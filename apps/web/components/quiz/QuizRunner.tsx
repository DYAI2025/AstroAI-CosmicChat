'use client';

import type { MarkerWeight, QuizDefinition, QuizOption } from '@quizzme/quiz-content';
import { useCallback, useState } from 'react';

import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';

interface QuizRunnerProps {
  quiz: QuizDefinition;
  onComplete: (markers: MarkerWeight[], profileId: string) => void;
}

export function QuizRunner({ quiz, onComplete }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [result, setResult] = useState<(typeof quiz.profiles)[0] | null>(null);

  const handleAnswer = useCallback(
    (option: QuizOption) => {
      const newAnswers = [...answers, option];
      setAnswers(newAnswers);

      if (currentIndex < quiz.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Calculate result
        const allMarkers = newAnswers.flatMap((a) => a.markers);

        // Simple scoring: count markers per profile
        const profileScores = quiz.profiles.map((profile) => {
          const score = profile.markers.reduce((sum, pm) => {
            const matchingMarkers = allMarkers.filter((m) => m.id === pm.id);
            return sum + matchingMarkers.reduce((s, m) => s + m.weight, 0);
          }, 0);
          return { profile, score };
        });

        // Get highest scoring profile
        const winner = profileScores.reduce((best, current) =>
          current.score > best.score ? current : best
        );

        setResult(winner.profile);
        onComplete(allMarkers, winner.profile.id);
      }
    },
    [answers, currentIndex, quiz, onComplete]
  );

  if (result) {
    return (
      <QuizResult profile={result} onContinue={() => (window.location.href = '/')} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light">{quiz.meta.title}</h1>
        <p className="text-gray-600">{quiz.meta.subtitle}</p>
      </div>

      <QuizQuestion
        question={quiz.questions[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={quiz.questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
