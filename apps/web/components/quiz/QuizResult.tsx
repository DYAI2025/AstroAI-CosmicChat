'use client';

import type { QuizProfile } from '@quizzme/quiz-content';

interface QuizResultProps {
  profile: QuizProfile;
  onContinue: () => void;
}

export function QuizResult({ profile, onContinue }: QuizResultProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-4">{profile.icon}</div>
      <h2 className="text-3xl font-light mb-2">{profile.title}</h2>
      <p className="text-lg text-gray-600 mb-6">{profile.tagline}</p>

      <p className="text-gray-700 mb-8">{profile.description}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-medium text-indigo-600">
              {stat.value}%
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Zurück zum Dashboard
      </button>
    </div>
  );
}
