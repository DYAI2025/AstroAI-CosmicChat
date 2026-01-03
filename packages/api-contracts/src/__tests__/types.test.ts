import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  ApiResponse,
  ApiError,
  ResponseMeta,
  PaginationParams,
  PaginatedResponse,
  AstroComputeRequest,
  AstroComputeOptions,
  AstroComputeResponse,
  ContributeRequest,
  ContributeResponse,
  ProfileSnapshotRequest,
  ProfileSnapshotResponse,
  ValidationResult,
  ValidationError,
  WebSocketEvent,
  WebSocketEventType,
} from '../types/api.js';
import type {
  TraitScore,
  QuestionType,
  QuizQuestion,
  QuizOption,
  ScaleConfig,
  QuizAnswer,
  QuizResponse,
  Quiz,
  QuizCategory,
  QuizProgress,
} from '../types/quiz.js';
import type {
  PsychologicalProfile,
  ZodiacSign,
  Planet,
  House,
  PlanetaryPlacement,
  Aspect,
  BirthData,
  AstrologicalProfile,
  UnifiedSnapshot,
  ProfileInsight,
} from '../types/profile.js';

/**
 * API Contracts Type Validation Tests
 *
 * These tests ensure that our TypeScript types are correctly defined
 * and that objects conforming to these types have the expected structure.
 *
 * Type tests serve as living documentation and prevent type regressions.
 */

describe('API Types', () => {
  describe('ApiResponse', () => {
    it('should allow success response with data', () => {
      const response: ApiResponse<{ name: string }> = {
        success: true,
        data: { name: 'test' },
      };

      expect(response.success).toBe(true);
      expect(response.data?.name).toBe('test');
    });

    it('should allow error response', () => {
      const errorResponse: ApiResponse<unknown> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
        },
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error?.code).toBe('VALIDATION_ERROR');
    });

    it('should include optional metadata', () => {
      const response: ApiResponse<string> = {
        success: true,
        data: 'test',
        meta: {
          requestId: 'req-123',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          processingTimeMs: 42,
        },
      };

      expect(response.meta?.requestId).toBe('req-123');
    });
  });

  describe('PaginatedResponse', () => {
    it('should have correct pagination structure', () => {
      const paginated: PaginatedResponse<{ id: string }> = {
        items: [{ id: '1' }, { id: '2' }],
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
        hasNextPage: true,
        hasPreviousPage: false,
      };

      expect(paginated.items.length).toBe(2);
      expect(paginated.totalPages).toBe(10);
      expect(paginated.hasNextPage).toBe(true);
    });
  });

  describe('AstroComputeRequest', () => {
    it('should accept valid birth data', () => {
      const request: AstroComputeRequest = {
        userId: 'user-123',
        birthData: {
          date: '1990-01-15',
          time: '14:30',
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'America/New_York',
        },
      };

      expect(request.userId).toBeDefined();
      expect(request.birthData.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should accept optional compute options', () => {
      const request: AstroComputeRequest = {
        userId: 'user-123',
        birthData: {
          date: '1990-01-15',
          time: '14:30',
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'America/New_York',
        },
        options: {
          houseSystem: 'placidus',
          includeMinorAspects: true,
          maxOrb: 8,
          includeAsteroids: false,
          includeFixedStars: false,
        },
      };

      expect(request.options?.houseSystem).toBe('placidus');
    });
  });

  describe('ValidationResult', () => {
    it('should represent valid data', () => {
      const valid: ValidationResult = {
        valid: true,
        errors: [],
      };

      expect(valid.valid).toBe(true);
      expect(valid.errors).toHaveLength(0);
    });

    it('should represent invalid data with errors', () => {
      const invalid: ValidationResult = {
        valid: false,
        errors: [
          {
            path: 'birthData.date',
            code: 'INVALID_DATE_FORMAT',
            message: 'Date must be in ISO 8601 format',
            expected: 'YYYY-MM-DD',
            received: '01/15/1990',
          },
        ],
      };

      expect(invalid.valid).toBe(false);
      expect(invalid.errors[0].path).toBe('birthData.date');
    });
  });
});

describe('Quiz Types', () => {
  describe('TraitScore', () => {
    it('should have required score fields', () => {
      const score: TraitScore = {
        traitId: 'extraversion',
        traitName: 'Extraversion',
        rawScore: 35,
        normalizedScore: 70,
        sampleSize: 10,
      };

      expect(score.normalizedScore).toBeGreaterThanOrEqual(0);
      expect(score.normalizedScore).toBeLessThanOrEqual(100);
    });

    it('should support optional confidence interval', () => {
      const score: TraitScore = {
        traitId: 'openness',
        traitName: 'Openness to Experience',
        rawScore: 42,
        normalizedScore: 84,
        sampleSize: 15,
        percentile: 85,
        confidenceInterval: {
          lower: 78,
          upper: 90,
        },
      };

      expect(score.confidenceInterval?.lower).toBeLessThan(score.normalizedScore);
      expect(score.confidenceInterval?.upper).toBeGreaterThan(score.normalizedScore);
    });
  });

  describe('QuestionType', () => {
    it('should support all question types', () => {
      const types: QuestionType[] = [
        'likert',
        'multiple',
        'ranking',
        'slider',
        'binary',
        'open',
      ];

      expect(types).toContain('likert');
      expect(types).toContain('open');
    });
  });

  describe('QuizQuestion', () => {
    it('should define a complete question structure', () => {
      const question: QuizQuestion = {
        id: 'q-001',
        quizId: 'personality-big5',
        text: 'I enjoy meeting new people',
        type: 'likert',
        scaleConfig: {
          min: 1,
          max: 5,
          step: 1,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree',
        },
        targetTraits: ['extraversion'],
        order: 1,
        required: true,
        reverseScored: false,
      };

      expect(question.type).toBe('likert');
      expect(question.targetTraits).toContain('extraversion');
    });

    it('should support multiple choice with options', () => {
      const question: QuizQuestion = {
        id: 'q-002',
        quizId: 'values-assessment',
        text: 'Which of these is most important to you?',
        type: 'multiple',
        options: [
          { id: 'opt-1', text: 'Family', value: 1 },
          { id: 'opt-2', text: 'Career', value: 2 },
          { id: 'opt-3', text: 'Adventure', value: 3 },
        ],
        targetTraits: ['values'],
        order: 1,
        required: true,
        reverseScored: false,
      };

      expect(question.options).toHaveLength(3);
    });
  });

  describe('QuizResponse', () => {
    it('should capture a complete quiz submission', () => {
      const response: QuizResponse = {
        id: 'resp-001',
        userId: 'user-123',
        quizId: 'personality-big5',
        answers: [
          {
            questionId: 'q-001',
            numericValue: 4,
            answeredAt: new Date(),
            responseTimeMs: 3500,
          },
        ],
        startedAt: new Date(),
        completedAt: new Date(),
        totalTimeMs: 300000,
        isComplete: true,
        scoringVersion: '2.0.0',
      };

      expect(response.isComplete).toBe(true);
      expect(response.answers.length).toBeGreaterThan(0);
    });
  });

  describe('QuizCategory', () => {
    it('should have defined categories', () => {
      const categories: QuizCategory[] = [
        'personality',
        'cognitive',
        'emotional',
        'social',
        'values',
        'compatibility',
      ];

      expect(categories).toContain('personality');
      expect(categories).toContain('compatibility');
    });
  });
});

describe('Profile Types', () => {
  describe('ZodiacSign', () => {
    it('should include all 12 zodiac signs', () => {
      const signs: ZodiacSign[] = [
        'aries',
        'taurus',
        'gemini',
        'cancer',
        'leo',
        'virgo',
        'libra',
        'scorpio',
        'sagittarius',
        'capricorn',
        'aquarius',
        'pisces',
      ];

      expect(signs).toHaveLength(12);
    });
  });

  describe('Planet', () => {
    it('should include all major planets', () => {
      const planets: Planet[] = [
        'sun',
        'moon',
        'mercury',
        'venus',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune',
        'pluto',
      ];

      expect(planets).toContain('sun');
      expect(planets).toContain('pluto');
    });
  });

  describe('House', () => {
    it('should be limited to 1-12', () => {
      const houses: House[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      expect(houses).toHaveLength(12);
      expect(Math.min(...houses)).toBe(1);
      expect(Math.max(...houses)).toBe(12);
    });
  });

  describe('PlanetaryPlacement', () => {
    it('should define a complete planetary position', () => {
      const placement: PlanetaryPlacement = {
        planet: 'sun',
        sign: 'capricorn',
        house: 10,
        degree: 25,
        isRetrograde: false,
      };

      expect(placement.degree).toBeGreaterThanOrEqual(0);
      expect(placement.degree).toBeLessThan(30);
    });
  });

  describe('Aspect', () => {
    it('should define an aspect between planets', () => {
      const aspect: Aspect = {
        planet1: 'sun',
        planet2: 'moon',
        type: 'conjunction',
        orb: 2.5,
        applying: true,
      };

      expect(aspect.type).toBe('conjunction');
      expect(aspect.orb).toBeLessThan(10);
    });

    it('should support all aspect types', () => {
      const aspectTypes: Aspect['type'][] = [
        'conjunction',
        'opposition',
        'trine',
        'square',
        'sextile',
      ];

      expect(aspectTypes).toHaveLength(5);
    });
  });

  describe('BirthData', () => {
    it('should require all birth data fields', () => {
      const birthData: BirthData = {
        date: '1990-01-15',
        time: '14:30',
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
      };

      expect(birthData.latitude).toBeGreaterThanOrEqual(-90);
      expect(birthData.latitude).toBeLessThanOrEqual(90);
      expect(birthData.longitude).toBeGreaterThanOrEqual(-180);
      expect(birthData.longitude).toBeLessThanOrEqual(180);
    });
  });

  describe('AstrologicalProfile', () => {
    it('should contain a complete natal chart', () => {
      const profile: AstrologicalProfile = {
        userId: 'user-123',
        birthData: {
          date: '1990-01-15',
          time: '14:30',
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'America/New_York',
        },
        sunSign: 'capricorn',
        moonSign: 'cancer',
        risingSign: 'gemini',
        placements: [
          {
            planet: 'sun',
            sign: 'capricorn',
            house: 8,
            degree: 25,
            isRetrograde: false,
          },
        ],
        aspects: [],
        calculatedAt: new Date(),
      };

      expect(profile.sunSign).toBe('capricorn');
      expect(profile.placements.length).toBeGreaterThan(0);
    });
  });

  describe('PsychologicalProfile', () => {
    it('should store trait scores and quiz history', () => {
      const profile: PsychologicalProfile = {
        userId: 'user-123',
        traits: {
          extraversion: {
            traitId: 'extraversion',
            traitName: 'Extraversion',
            rawScore: 35,
            normalizedScore: 70,
            sampleSize: 10,
          },
        },
        completedQuizzes: ['big5', 'values'],
        lastUpdated: new Date(),
      };

      expect(Object.keys(profile.traits)).toContain('extraversion');
      expect(profile.completedQuizzes).toContain('big5');
    });
  });

  describe('UnifiedSnapshot', () => {
    it('should combine psychological and astrological data', () => {
      const snapshot: UnifiedSnapshot = {
        snapshotId: 'snap-001',
        userId: 'user-123',
        psychological: {
          userId: 'user-123',
          traits: {},
          completedQuizzes: [],
          lastUpdated: new Date(),
        },
        insights: [
          {
            id: 'insight-001',
            category: 'strength',
            source: 'psychological',
            title: 'High Openness',
            description: 'You score high on openness to experience',
            confidence: 0.85,
            relatedElements: ['openness'],
          },
        ],
        harmonyScore: 0.78,
        createdAt: new Date(),
        version: 1,
      };

      expect(snapshot.harmonyScore).toBeGreaterThanOrEqual(0);
      expect(snapshot.harmonyScore).toBeLessThanOrEqual(1);
      expect(snapshot.insights).toHaveLength(1);
    });

    it('should allow partial profiles', () => {
      // User might have psychological profile but no birth data yet
      const partialSnapshot: UnifiedSnapshot = {
        snapshotId: 'snap-002',
        userId: 'user-456',
        psychological: {
          userId: 'user-456',
          traits: {},
          completedQuizzes: ['intro-quiz'],
          lastUpdated: new Date(),
        },
        // astrological is undefined
        insights: [],
        createdAt: new Date(),
        version: 1,
      };

      expect(partialSnapshot.astrological).toBeUndefined();
      expect(partialSnapshot.psychological).toBeDefined();
    });
  });

  describe('ProfileInsight', () => {
    it('should categorize insights correctly', () => {
      const categories: ProfileInsight['category'][] = [
        'strength',
        'challenge',
        'opportunity',
        'pattern',
      ];

      const sources: ProfileInsight['source'][] = [
        'psychological',
        'astrological',
        'combined',
      ];

      expect(categories).toHaveLength(4);
      expect(sources).toHaveLength(3);
    });
  });
});

describe('WebSocket Types', () => {
  describe('WebSocketEvent', () => {
    it('should define valid event types', () => {
      const eventTypes: WebSocketEventType[] = [
        'profile:updated',
        'quiz:progress',
        'insight:generated',
        'sync:status',
      ];

      expect(eventTypes).toContain('profile:updated');
    });

    it('should have typed payloads', () => {
      const event: WebSocketEvent<{ version: number }> = {
        type: 'profile:updated',
        userId: 'user-123',
        payload: { version: 5 },
        timestamp: new Date().toISOString(),
      };

      expect(event.payload.version).toBe(5);
    });
  });
});

describe('Type Safety Checks', () => {
  it('should enforce required fields at compile time', () => {
    // This test documents the required structure
    // TypeScript compilation would fail if required fields are missing
    const validTraitScore: TraitScore = {
      traitId: 'test',
      traitName: 'Test Trait',
      rawScore: 50,
      normalizedScore: 75,
      sampleSize: 10,
    };

    expect(validTraitScore).toBeDefined();
  });

  it('should allow extension of generic types', () => {
    interface CustomPayload {
      customField: string;
      count: number;
    }

    const response: ApiResponse<CustomPayload> = {
      success: true,
      data: {
        customField: 'test',
        count: 42,
      },
    };

    expect(response.data?.customField).toBe('test');
    expect(response.data?.count).toBe(42);
  });
});
