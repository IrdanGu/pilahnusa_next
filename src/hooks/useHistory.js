import { useState, useCallback, useEffect } from 'react';
import { getHistory, saveHistoryItem, deleteHistoryItem, clearHistory } from '../utils/storageUtils';
import { getOrCreateUserId } from '../utils/userUtils';
import { 
  fetchHistoryFromSupabase, 
  saveScanToSupabase, 
  deleteHistoryItemFromSupabase,
  clearHistoryFromSupabase,
  submitUserFeedbackToSupabase,
  checkFeedbackStatusFromSupabase
} from '../services/supabaseClient';

const FEEDBACK_SUBMITTED_KEY = 'bilahbeu_feedback_submitted';

/**
 * Custom hook for managing scan history and general user feedback via localStorage & Supabase
 */
const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Load history & feedback status on mount (syncs LocalStorage and Supabase)
  useEffect(() => {
    const loadHistoryAndFeedback = async () => {
      // 1. Fast load from localStorage for instant UX
      const localHistory = getHistory();
      setHistory(localHistory);
      
      const localFeedbackStatus = localStorage.getItem(FEEDBACK_SUBMITTED_KEY) === 'true';
      setFeedbackSubmitted(localFeedbackStatus);
      setIsLoaded(true);

      const userId = getOrCreateUserId();
      if (userId) {
        // 2. Sync history from Supabase in the background
        const historyRes = await fetchHistoryFromSupabase(userId);
        if (historyRes.success && historyRes.data) {
          setHistory(historyRes.data);
          try {
            localStorage.setItem('bilahbeu_history', JSON.stringify(historyRes.data));
          } catch (e) {
            console.error('Failed to sync Supabase history to localStorage:', e);
          }
        }

        // 3. Sync feedback status in the background if not submitted locally
        if (!localFeedbackStatus) {
          const feedbackRes = await checkFeedbackStatusFromSupabase(userId);
          if (feedbackRes.success && feedbackRes.submitted) {
            setFeedbackSubmitted(true);
            try {
              localStorage.setItem(FEEDBACK_SUBMITTED_KEY, 'true');
            } catch (e) {
              console.error('Failed to save feedback status to localStorage:', e);
            }
          }
        }
      }
    };

    loadHistoryAndFeedback();
  }, []);

  /**
   * Add a new scan result to history
   * @param {Object} item - History item to add
   */
  const addToHistory = useCallback((item) => {
    // Save to local storage
    const updatedHistory = saveHistoryItem(item);
    setHistory(updatedHistory);

    // Sync to Supabase in the background (does not block UI)
    const userId = getOrCreateUserId();
    if (userId) {
      saveScanToSupabase(item, userId).catch((err) => {
        console.error('Failed to sync new scan to Supabase:', err);
      });
    }
    return item;
  }, []);

  /**
   * Submit one-time user feedback (rating & message)
   * @param {number} rating - Rating score (1-5)
   * @param {string} feedbackMessage - Review text
   * @returns {Promise<{success: boolean, error: any}>}
   */
  const submitUserFeedback = useCallback(async (rating, feedbackMessage) => {
    const userId = getOrCreateUserId();
    if (!userId) {
      return { success: false, error: 'User ID not initialized' };
    }

    // 1. Optimistically update local state & cache
    setFeedbackSubmitted(true);
    try {
      localStorage.setItem(FEEDBACK_SUBMITTED_KEY, 'true');
    } catch (e) {
      console.error('Failed to save feedback status in localStorage:', e);
    }

    // 2. Send request to Supabase
    let success = false;
    let error = null;
    try {
      const res = await submitUserFeedbackToSupabase(userId, rating, feedbackMessage);
      success = res.success;
      error = res.error;
    } catch (err) {
      console.error('Supabase feedback submit failed:', err);
      error = err;
    }

    return { success, error };
  }, []);

  /**
   * Remove an item from history by ID
   * @param {string} id - Item ID
   */
  const removeFromHistory = useCallback((id) => {
    const updatedHistory = deleteHistoryItem(id);
    setHistory(updatedHistory);

    // Sync deletion to Supabase in the background
    const userId = getOrCreateUserId();
    if (userId) {
      deleteHistoryItemFromSupabase(id, userId).catch((err) => {
        console.error('Failed to delete scan from Supabase:', err);
      });
    }
  }, []);

  /**
   * Clear all history items
   */
  const clearAllHistory = useCallback(() => {
    clearHistory();
    setHistory([]);

    // Sync clearing to Supabase in the background
    const userId = getOrCreateUserId();
    if (userId) {
      clearHistoryFromSupabase(userId).catch((err) => {
        console.error('Failed to clear history from Supabase:', err);
      });
    }
  }, []);

  /**
   * Filter history by category
   * @param {string} category - Category to filter by ('all' for no filter)
   * @returns {Array} Filtered history
   */
  const filterByCategory = useCallback((category) => {
    if (category === 'all') return history;
    return history.filter((item) => item.result?.category === category);
  }, [history]);

  /**
   * Search history by name
   * @param {string} query - Search query
   * @returns {Array} Matching history items
   */
  const searchHistory = useCallback((query) => {
    if (!query.trim()) return history;
    const lowerQuery = query.toLowerCase();
    return history.filter(
      (item) =>
        item.result?.name?.toLowerCase().includes(lowerQuery) ||
        item.result?.category?.toLowerCase().includes(lowerQuery)
    );
  }, [history]);

  const totalScans = history.length;
  const categoryCounts = history.reduce((acc, item) => {
    const cat = item.result?.category || 'unknown';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return {
    history,
    isLoaded,
    totalScans,
    categoryCounts,
    feedbackSubmitted,
    addToHistory,
    submitUserFeedback,
    removeFromHistory,
    clearAllHistory,
    filterByCategory,
    searchHistory,
  };
};

export default useHistory;
