import { useCallback, useEffect, useState } from 'react';
import useHistory from './useHistory';
import { getImpactLedger, resetImpactLedger as resetLedger } from '../utils/storageUtils';
import { computeLevel, computeStreak, computeWeeklyActivity, evaluateBadges } from '../utils/ecoCalculations';

const useEcoImpact = () => {
  const { history } = useHistory();
  const [ledger, setLedger] = useState(() => getImpactLedger());
  const refreshImpact = useCallback(() => setLedger(getImpactLedger()), []);

  useEffect(() => { refreshImpact(); }, [history, refreshImpact]);
  const streak = computeStreak(ledger.scanDates);
  const levelInfo = computeLevel(ledger.totalPoints);
  const badges = evaluateBadges(ledger, streak);
  const resetImpact = useCallback(() => setLedger(resetLedger()), []);

  return {
    ledger,
    level: levelInfo.level,
    nextLevel: levelInfo.nextLevel,
    progressPercent: levelInfo.progressPercent,
    streak,
    badges,
    unlockedCount: badges.length,
    weeklyActivity: computeWeeklyActivity(history),
    resetImpact,
    refreshImpact,
  };
};

export default useEcoImpact;
