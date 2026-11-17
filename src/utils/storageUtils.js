/**
 * LocalStorage utility helpers for BilahBeu AI
 */

const HISTORY_KEY = 'bilahbeu_history';
const MAX_HISTORY_ITEMS = 50;

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
  try {
    const history = getHistory();
    const newHistory = [item, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Failed to save history item:', error);
    return getHistory();
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
