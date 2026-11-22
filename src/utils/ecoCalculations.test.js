import { describe, expect, it } from 'vitest';
import { computeItemImpact, computeLevel, computeStreak, computeWeeklyActivity, evaluateBadges } from './ecoCalculations';

describe('eco calculations', () => {
  it('computes category impact', () => {
    expect(computeItemImpact('B3')).toEqual({ category: 'B3', co2SavedKg: 0.9, points: 25 });
  });

  it('computes levels and streaks', () => {
    expect(computeLevel(500).levelName).toBe('Duta Daur Ulang');
    expect(computeStreak(['2026-11-21T10:00:00Z', '2026-11-20T10:00:00Z'], new Date('2026-11-21T12:00:00Z'))).toBe(2);
  });

  it('creates seven activity bars and evaluates badges', () => {
    expect(computeWeeklyActivity([], new Date('2026-11-21T12:00:00Z'))).toHaveLength(7);
    expect(evaluateBadges({ totalScans: 1, categoryCounts: {}, quizPerfectCount: 0, favoritesCount: 0 }, 0).length).toBeGreaterThan(0);
  });
});
