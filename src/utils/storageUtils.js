/**
 * LocalStorage utility helpers for BilahBeu AI
 */

const HISTORY_KEY = 'bilahbeu_history';
const MAX_HISTORY_ITEMS = 50;
const LEDGER_KEY = 'bilahbeu_impact_ledger';

const emptyLedger = () => ({
  totalScans: 0,
  totalPoints: 0,
  co2SavedKg: 0,
  categoryCounts: { Organik: 0, Anorganik: 0, B3: 0 },
  scanDates: [],
  quizBestScore: 0,
  quizPerfectCount: 0,
  favoritesCount: 0,
});

const normalizeLedger = (ledger) => ({
  ...emptyLedger(),
  ...ledger,
  categoryCounts: { ...emptyLedger().categoryCounts, ...(ledger?.categoryCounts || {}) },
  scanDates: Array.isArray(ledger?.scanDates) ? ledger.scanDates : [],
});

export const getImpactLedger = () => {
  try {
    const saved = localStorage.getItem(LEDGER_KEY);
    if (saved) return normalizeLedger(JSON.parse(saved));
  } catch (error) {
    console.error('Failed to read impact ledger:', error);
  }

  const ledger = emptyLedger();
  const history = getHistory();
  history.forEach((item) => {
    const category = item?.result?.category;
    if (category === 'Organik') { ledger.categoryCounts.Organik += 1; ledger.totalPoints += 10; ledger.co2SavedKg += 0.35; }
    if (category === 'Anorganik') { ledger.categoryCounts.Anorganik += 1; ledger.totalPoints += 15; ledger.co2SavedKg += 0.65; }
    if (category === 'B3') { ledger.categoryCounts.B3 += 1; ledger.totalPoints += 25; ledger.co2SavedKg += 0.90; }
    const date = item?.timestamp ? new Date(item.timestamp) : null;
    if (date && !Number.isNaN(date.getTime())) {
      const isoDate = date.toISOString().slice(0, 10);
      ledger.scanDates.push(isoDate);
    }
  });
  ledger.totalScans = history.length;
  ledger.scanDates = [...new Set(ledger.scanDates)];
  ledger.co2SavedKg = Number(ledger.co2SavedKg.toFixed(3));
  try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); } catch (error) {
    console.error('Failed to backfill impact ledger:', error);
  }
  return ledger;
};

export const recordImpactScan = (item) => {
  const ledger = getImpactLedger();
  const category = item?.result?.category;
  if (category === 'Organik') { ledger.totalPoints += 10; ledger.co2SavedKg += 0.35; ledger.categoryCounts.Organik += 1; }
  if (category === 'Anorganik') { ledger.totalPoints += 15; ledger.co2SavedKg += 0.65; ledger.categoryCounts.Anorganik += 1; }
  if (category === 'B3') { ledger.totalPoints += 25; ledger.co2SavedKg += 0.90; ledger.categoryCounts.B3 += 1; }
  ledger.totalScans += 1;
  const date = item?.timestamp ? new Date(item.timestamp) : new Date();
  if (!Number.isNaN(date.getTime())) ledger.scanDates = [...new Set([...ledger.scanDates, date.toISOString().slice(0, 10)])];
  ledger.co2SavedKg = Number(ledger.co2SavedKg.toFixed(3));
  try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); } catch (error) {
    console.error('Failed to save impact ledger:', error);
  }
  return ledger;
};

export const recordImpactQuiz = (correctCount, total) => {
  const ledger = getImpactLedger();
  ledger.quizBestScore = Math.max(Number(ledger.quizBestScore) || 0, Number(correctCount) || 0);
  if (Number(correctCount) === Number(total)) ledger.quizPerfectCount += 1;
  try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); } catch (error) {
    console.error('Failed to save quiz impact:', error);
  }
  return ledger;
};

export const recordImpactFavoriteCount = (count) => {
  const ledger = getImpactLedger();
  ledger.favoritesCount = Math.max(0, Number(count) || 0);
  try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); } catch (error) {
    console.error('Failed to save favorite impact:', error);
  }
  return ledger;
};

export const resetImpactLedger = () => {
  const ledger = emptyLedger();
  try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger)); } catch (error) {
    console.error('Failed to reset impact ledger:', error);
  }
  return ledger;
};

/**
 * Get all scan history items from localStorage
 * @returns {Array} Array of history items
 */
export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to read history from localStorage:', error);
    return [];
  }
};

/**
 * Save a new scan result to history
 * @param {Object} item - Scan result item to save
 * @returns {Array} Updated history array
 */
export const saveHistoryItem = (item) => {
  return saveHistoryItemWithMeta(item).history;
};

export const saveHistoryItemWithMeta = (item) => {
  let history = [item, ...getHistory()].slice(0, MAX_HISTORY_ITEMS);
  let result = history;
  let strippedImages = 0;
  let evictedItems = 0;

  const persist = (value) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(value));
      return true;
    } catch (error) {
      if (error?.name !== 'QuotaExceededError' && error?.code !== 22 && error?.code !== 1014) throw error;
      return false;
    }
  };

  try {
    if (persist(history)) return { history, strippedImages, evictedItems };

    for (let i = history.length - 1; i >= 0; i -= 1) {
      if (i === 0 && !history[i]?.imageBase64) continue;
      if (history[i]?.imageBase64) {
        history = history.map((entry, index) => index === i ? { ...entry, imageBase64: undefined } : entry);
        strippedImages += 1;
        if (persist(history)) return { history, strippedImages, evictedItems };
      }
    }

    while (history.length > 1) {
      history = history.slice(0, -1);
      evictedItems += 1;
      if (persist(history)) return { history, strippedImages, evictedItems };
    }

    if (history[0]?.imageBase64) {
      history = [{ ...history[0], imageBase64: undefined }];
      strippedImages += 1;
      if (persist(history)) return { history, strippedImages, evictedItems };
    }

    result = history;
    return { history: result, strippedImages, evictedItems };
  } catch (error) {
    console.error('Failed to save history item:', error);
    return { history: result, strippedImages, evictedItems };
  }
};

/**
 * Delete a specific history item by ID
 * @param {string} id - Item ID to delete
 * @returns {Array} Updated history array
 */
export const deleteHistoryItem = (id) => {
  try {
    const history = getHistory();
    const newHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return getHistory();
  }
};

/**
 * Clear all scan history
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

/**
 * Get a single history item by ID
 * @param {string} id - Item ID
 * @returns {Object|null} History item or null
 */
export const getHistoryItemById = (id) => {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
};
