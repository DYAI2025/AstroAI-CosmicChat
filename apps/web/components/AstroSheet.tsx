'use client';

/**
 * AstroSheet Component - Profile Dashboard
 * Displays the user's psychological profile and trait scores.
 */

import React from 'react';

import { useProfile } from '../lib/profile-context';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface TraitBarProps {
  traitId: string;
  label: string;
  score: number;
  confidence: number;
  lowLabel: string;
  highLabel: string;
}

function TraitBar({ label, score, confidence, lowLabel, highLabel }: TraitBarProps) {
  const percentage = Math.round(score * 100);
  const isLowConfidence = confidence < 0.3;

  return (
    <div className="trait-bar-container mb-6">
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-medium text-gray-900">{label}</span>
        <span className={`text-sm ${isLowConfidence ? 'text-gray-400' : 'text-gray-600'}`}>
          {percentage}%
          {isLowConfidence && ' (niedrige Konfidenz)'}
        </span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLowConfidence ? 'bg-gray-400' : 'bg-indigo-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ProfileLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
      <p className="text-gray-600">Profil wird geladen...</p>
    </div>
  );
}

function EmptyProfile() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-xl font-bold mb-2">Noch keine Daten</h3>
      <p className="text-gray-600 mb-6">
        Absolviere Quizzes, um dein Persönlichkeitsprofil zu erstellen.
      </p>
      <a
        href="/verticals/quiz"
        className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Zum ersten Quiz
      </a>
    </div>
  );
}

interface ProfileStatsProps {
  completeness: number;
  traitCount: number;
  quizCount: number;
}

function ProfileStats({ completeness, traitCount, quizCount }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-indigo-50 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-indigo-600">
          {Math.round(completeness * 100)}%
        </div>
        <div className="text-sm text-gray-600">Vollständigkeit</div>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-green-600">{traitCount}</div>
        <div className="text-sm text-gray-600">Traits gemessen</div>
      </div>
      <div className="bg-amber-50 rounded-xl p-4 text-center">
        <div className="text-3xl font-bold text-amber-600">{quizCount}</div>
        <div className="text-sm text-gray-600">Quizzes absolviert</div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AstroSheet() {
  const { snapshot, isLoading, getAllTraits, resetProfile } = useProfile();

  // Get all trait definitions for labels
  const traitDefs = getAllTraits();
  const traitDefMap = new Map(traitDefs.map((t) => [t.traitId, t]));

  if (isLoading) {
    return <ProfileLoading />;
  }

  // Check if we have any trait data
  const hasTraitData = snapshot && snapshot.traits.length > 0;

  if (!hasTraitData) {
    return <EmptyProfile />;
  }

  // Get stats
  const measuredTraits = snapshot.traits.filter((t) => t.confidence > 0);
  const quizCount = snapshot.contributingQuizIds.length;

  return (
    <div className="astrosheet">
      {/* Stats Section */}
      <ProfileStats
        completeness={snapshot.completeness}
        traitCount={measuredTraits.length}
        quizCount={quizCount}
      />

      {/* Traits Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Deine Persönlichkeitsmerkmale</h2>

        {snapshot.traits.map((traitData) => {
          const def = traitDefMap.get(traitData.traitId);
          return (
            <TraitBar
              key={traitData.traitId}
              traitId={traitData.traitId}
              label={def?.name ?? traitData.traitId}
              score={traitData.aggregatedScore}
              confidence={traitData.confidence}
              lowLabel={def?.lowLabel ?? 'Niedrig'}
              highLabel={def?.highLabel ?? 'Hoch'}
            />
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <a
          href="/verticals/quiz"
          className="flex-1 text-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Weitere Quizzes
        </a>
        <button
          onClick={() => {
            if (confirm('Möchtest du dein Profil wirklich zurücksetzen?')) {
              resetProfile();
            }
          }}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Zurücksetzen
        </button>
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-500">
        <p>Snapshot ID: {snapshot.snapshotId}</p>
        <p>Timestamp: {new Date(snapshot.timestamp).toLocaleString()}</p>
        <p>Contributing Quizzes: {snapshot.contributingQuizIds.join(', ') || 'keine'}</p>
      </div>
    </div>
  );
}
