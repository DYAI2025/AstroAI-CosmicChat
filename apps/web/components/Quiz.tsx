'use client';

/**
 * Quiz Component - Fat Component for Quiz Taking
 * Handles all quiz logic: display, answers, submission, results
 */

import type { QuestionDefinition, QuizAnswer, QuizDefinition } from '@quizzme/domain';
import React, { useState, useCallback, useMemo } from 'react';

import { useProfile } from '../lib/profile-context';

// =============================================================================
// TYPES
// =============================================================================

interface QuizProps {
  quizId: string;
  onComplete?: (scores: { traitId: string; score: number }[]) => void;
}

type QuizState = 'intro' | 'questions' | 'submitting' | 'results';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface QuizIntroProps {
  quiz: QuizDefinition;
  onStart: () => void;
}

function QuizIntro({ quiz, onStart }: QuizIntroProps) {
  return (
    <div className="quiz-intro">
      <h1 className="text-3xl font-bold mb-4">{quiz.name}</h1>
      <p className="text-gray-600 mb-6">{quiz.description}</p>
      <div className="flex gap-4 text-sm text-gray-500 mb-8">
        <span>{quiz.questions.length} Fragen</span>
        <span>~{quiz.estimatedMinutes} Minuten</span>
      </div>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Quiz starten
      </button>
    </div>
  );
}

interface QuestionCardProps {
  question: QuestionDefinition;
  questionNumber: number;
  totalQuestions: number;
  selectedValue: number | string | null;
  onSelect: (value: number | string) => void;
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <div className="text-sm text-gray-500 mb-2">
        Frage {questionNumber} von {totalQuestions}
      </div>
      <div className="h-1 bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>
      <h2 className="text-xl font-medium mb-8">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={String(option.value)}
            onClick={() => onSelect(option.value)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedValue === option.value
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

function QuizNavigation({
  canGoBack,
  canGoNext,
  isLastQuestion,
  onBack,
  onNext,
  onSubmit,
}: QuizNavigationProps) {
  return (
    <div className="flex justify-between mt-8">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`px-6 py-2 rounded-lg transition-colors ${
          canGoBack
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        Zurück
      </button>
      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={!canGoNext}
          className={`px-8 py-2 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Abschließen
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Weiter
        </button>
      )}
    </div>
  );
}

interface QuizResultsProps {
  scores: { traitId: string; score: number; label: string }[];
  onViewProfile: () => void;
  onRetake: () => void;
}

function QuizResults({ scores, onViewProfile, onRetake }: QuizResultsProps) {
  return (
    <div className="quiz-results">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✨</div>
        <h2 className="text-2xl font-bold mb-2">Quiz abgeschlossen!</h2>
        <p className="text-gray-600">Deine Ergebnisse wurden zu deinem Profil hinzugefügt.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="font-medium mb-4">Deine Trait-Scores:</h3>
        <div className="space-y-4">
          {scores.map(({ traitId, score, label }) => (
            <div key={traitId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{label}</span>
                <span className="text-gray-600">{Math.round(score * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onViewProfile}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Profil ansehen
        </button>
        <button
          onClick={onRetake}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Quiz wiederholen
        </button>
      </div>
    </div>
  );
}

function QuizLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );
}

function QuizNotFound() {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🔍</div>
      <h2 className="text-xl font-bold mb-2">Quiz nicht gefunden</h2>
      <p className="text-gray-600">Dieses Quiz existiert nicht oder wurde entfernt.</p>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function Quiz({ quizId, onComplete }: QuizProps) {
  const { getQuiz, getTrait, submitQuizAnswers, isLoading: profileLoading } = useProfile();

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | string>>(new Map());
  const [resultScores, setResultScores] = useState<
    { traitId: string; score: number; label: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Get quiz definition
  const quiz = useMemo(() => getQuiz(quizId), [getQuiz, quizId]);

  // Current question
  const currentQuestion = useMemo(() => {
    if (!quiz) return null;
    return quiz.questions[currentQuestionIndex] ?? null;
  }, [quiz, currentQuestionIndex]);

  // Navigation state
  const canGoBack = currentQuestionIndex > 0;
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.questionId) : null;
  const canGoNext = currentAnswer !== null && currentAnswer !== undefined;
  const isLastQuestion = quiz ? currentQuestionIndex === quiz.questions.length - 1 : false;

  // Handlers
  const handleStart = useCallback(() => {
    setQuizState('questions');
    setCurrentQuestionIndex(0);
    setAnswers(new Map());
  }, []);

  const handleSelectAnswer = useCallback(
    (value: number | string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => new Map(prev).set(currentQuestion.questionId, value));
    },
    [currentQuestion]
  );

  const handleBack = useCallback(() => {
    if (canGoBack) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [canGoBack]);

  const handleNext = useCallback(() => {
    if (canGoNext && quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [canGoNext, quiz, currentQuestionIndex]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || !canGoNext) return;

    setQuizState('submitting');
    setError(null);

    try {
      // Convert answers map to QuizAnswer array
      const quizAnswers: QuizAnswer[] = Array.from(answers.entries()).map(
        ([questionId, value]) => ({
          quizId: quiz.quizId,
          questionId,
          selectedValue: value,
          timestamp: Date.now(),
        })
      );

      // Submit to engine
      const scores = await submitQuizAnswers(quizAnswers);

      // Format results
      const formattedScores = scores.map((s) => {
        const trait = getTrait(s.traitId);
        return {
          traitId: s.traitId,
          score: s.score,
          label: trait?.name ?? s.traitId,
        };
      });

      setResultScores(formattedScores);
      setQuizState('results');

      // Call completion callback
      if (onComplete) {
        onComplete(formattedScores);
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
      setQuizState('questions');
    }
  }, [quiz, canGoNext, answers, submitQuizAnswers, getTrait, onComplete]);

  const handleViewProfile = useCallback(() => {
    window.location.href = '/astrosheet';
  }, []);

  const handleRetake = useCallback(() => {
    handleStart();
  }, [handleStart]);

  // Loading state
  if (profileLoading) {
    return <QuizLoading />;
  }

  // Quiz not found
  if (!quiz) {
    return <QuizNotFound />;
  }

  // Render based on state
  return (
    <div className="quiz-container max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {quizState === 'intro' && <QuizIntro quiz={quiz} onStart={handleStart} />}

      {quizState === 'questions' && currentQuestion && (
        <>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            selectedValue={currentAnswer ?? null}
            onSelect={handleSelectAnswer}
          />
          <QuizNavigation
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            isLastQuestion={isLastQuestion}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </>
      )}

      {quizState === 'submitting' && (
        <div className="text-center py-12">
          <QuizLoading />
          <p className="mt-4 text-gray-600">Ergebnisse werden berechnet...</p>
        </div>
      )}

      {quizState === 'results' && (
        <QuizResults
          scores={resultScores}
          onViewProfile={handleViewProfile}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}

// =============================================================================
// QUIZ LIST COMPONENT
// =============================================================================

export function QuizList() {
  const { getAllQuizzes, isLoading } = useProfile();
  const quizzes = useMemo(() => getAllQuizzes(), [getAllQuizzes]);

  if (isLoading) {
    return <QuizLoading />;
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Keine Quizzes verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="quiz-list grid gap-6">
      {quizzes.map((quiz) => (
        <a
          key={quiz.quizId}
          href={`/verticals/quiz/${quiz.quizId}`}
          className="block p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-bold mb-2">{quiz.name}</h3>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{quiz.questions.length} Fragen</span>
            <span>~{quiz.estimatedMinutes} Min</span>
            <span className="capitalize">{quiz.category}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
