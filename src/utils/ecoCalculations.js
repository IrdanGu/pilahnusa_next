import { CATEGORY_CO2_SAVED_KG, CATEGORY_POINTS, ECO_LEVELS, ECO_BADGES } from '../data/ecoImpactData';

export const computeItemImpact = (itemOrCategory) => {
  const category = typeof itemOrCategory === 'string' ? itemOrCategory : itemOrCategory?.category || itemOrCategory?.result?.category;
  return {
    category,
    co2SavedKg: CATEGORY_CO2_SAVED_KG[category] || 0,
    points: CATEGORY_POINTS[category] || 0,
  };
};

export const computeStreak = (scanDates = [], today = new Date()) => {
  const dates = new Set((scanDates || []).map((value) => new Date(value).toISOString().slice(0, 10)));
  const cursor = new Date(today);
  cursor.setHours(12, 0, 0, 0);
  let streak = 0;
  let key = cursor.toISOString().slice(0, 10);
  if (!dates.has(key)) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const computeLevel = (points = 0) => {
  const safePoints = Math.max(0, Number(points) || 0);
  let index = 0;
  ECO_LEVELS.forEach((level, i) => { if (safePoints >= level.minPoints) index = i; });
  const level = ECO_LEVELS[index];
  const nextLevel = ECO_LEVELS[index + 1] || null;
  const progressPercent = nextLevel
    ? Math.min(100, Math.max(0, ((safePoints - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100))
    : 100;
  return { level, nextLevel, progressPercent, levelName: level.name };
};

export const computeWeeklyActivity = (history = [], today = new Date()) => {
  const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const items = (history || []).filter((item) => {
      const stamp = item?.timestamp ? new Date(item.timestamp) : null;
      return stamp && !Number.isNaN(stamp.getTime()) && stamp.toISOString().slice(0, 10) === key;
    });
    return { date: key, label: days[date.getDay()], count: items.length, scans: items.length, points: items.reduce((sum, item) => sum + (computeItemImpact(item).points || 0), 0) };
  });
};

export const evaluateBadges = (ledger = {}, streak = 0) =>
  ECO_BADGES.filter((badge) => badge.condition({ ledger, streak }));
