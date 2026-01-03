'use client';

import type { QuizOption, QuizQuestion as QuizQuestionType } from '@quizzme/quiz-content';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (option: QuizOption) => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-sm text-gray-500 mb-2">
        Frage {questionNumber} von {totalQuestions}
      </div>

      {question.scenario && (
        <p className="text-gray-600 italic mb-4">{question.scenario}</p>
      )}

      <h2 className="text-2xl font-medium mb-8">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option)}
            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
