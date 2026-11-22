import axios from 'axios';
import { getOfflineAnswer } from '../data/chatbotFallbackData';

/**
 * Send a waste education question to the Gemini-powered backend chatbot.
 * @param {string} message
 * @returns {Promise<string>}
 */
export const sendChatbotMessage = async (message) => {
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedMessage) {
    throw new Error('Tulis pertanyaan terlebih dahulu.');
  }

  try {
    const response = await axios.post('/api/chatbot', { message: trimmedMessage }, { timeout: 20000 });
    return response.data?.reply || getOfflineAnswer(trimmedMessage);
  } catch (error) {
    return getOfflineAnswer(trimmedMessage);
  }
};

export const sendChatMessage = async (message, { contextItem } = {}) => {
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';
  if (!trimmedMessage) throw new Error('Tulis pertanyaan terlebih dahulu.');

  try {
    const response = await axios.post(
      '/api/chatbot',
      { message: trimmedMessage, ...(contextItem ? { contextItem } : {}) },
      { timeout: 20000 }
    );
    if (response.data?.reply) return { reply: response.data.reply, source: 'online' };
  } catch (error) {
    // All network and backend failures use the local offline brain.
  }
  return { reply: getOfflineAnswer(trimmedMessage, contextItem), source: 'offline' };
};
