import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { sendChatMessage, sendChatbotMessage } from './chatbotService';

vi.mock('axios');

beforeEach(() => vi.clearAllMocks());

describe('chatbot service', () => {
  it('returns online responses', async () => {
    axios.post.mockResolvedValue({ data: { reply: 'Jawaban online' } });
    await expect(sendChatMessage('Bagaimana pilah plastik?', {})).resolves.toEqual({ reply: 'Jawaban online', source: 'online' });
  });

  it('falls back to the offline brain for errors', async () => {
    axios.post.mockRejectedValue(new Error('offline'));
    const result = await sendChatMessage('kompos', {});
    expect(result.source).toBe('offline');
    expect(result.reply).toContain('kompos');
  });

  it('preserves the legacy string return shape', async () => {
    axios.post.mockRejectedValue(new Error('offline'));
    await expect(sendChatbotMessage('baterai')).resolves.toEqual(expect.any(String));
  });
});
