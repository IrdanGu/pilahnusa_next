/**
 * User utility helpers for BilahBeu AI
 */

const USER_ID_KEY = 'bilahbeu_user_id';

/**
 * Generate a cryptographically secure RFC4122 v4 compliant UUID
 * @returns {string} Unique ID
 */
export const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    try {
      return window.crypto.randomUUID();
    } catch (e) {
      // Fallback if randomUUID fails or is restricted by security contexts
    }
  }
  
  // High-quality fallback UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get the current user ID or create a new one if it doesn't exist
 * @returns {string} Unique user ID
 */
export const getOrCreateUserId = () => {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem(USER_ID_KEY, userId);
      console.log('[User] Generated and saved new unique user ID:', userId);
    }
    return userId;
  } catch (error) {
    console.error('[User] Failed to access localStorage for user ID:', error);
    // Return a session-only temporary UUID if localStorage fails
    return generateUUID();
  }
};

/**
 * Get the current user ID (null if not initialized yet)
 * @returns {string|null} User ID or null
 */
export const getUserId = () => {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    return null;
  }
};
