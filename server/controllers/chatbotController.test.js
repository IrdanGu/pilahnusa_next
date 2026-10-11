import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatbotReply } from './chatbotController.js';

test('rejects empty chatbot messages', async () => {
  await assert.rejects(
    () => createChatbotReply({ message: '   ', apiKey: 'test-key', fetchFn: async () => ({}) }),
    /Pertanyaan tidak boleh kosong/
  );
});

test('requires a Gemini API key', async () => {
  await assert.rejects(
    () => createChatbotReply({ message: 'Bagaimana memilah botol plastik?', apiKey: '', fetchFn: async () => ({}) }),
    /GEMINI_API_KEY belum dikonfigurasi/
  );
});

test('returns normalized text from Gemini response', async () => {
  const reply = await createChatbotReply({
    message: 'Bagaimana memilah botol plastik?',
    apiKey: 'test-key',
    fetchFn: async (url, options) => {
      assert.match(url, /gemini-2\.5-flash/);
      assert.match(url, /key=test-key/);

      const body = JSON.parse(options.body);
      assert.equal(body.contents[0].parts[0].text.includes('PilahNusa'), true);
      assert.equal(body.contents[0].parts[0].text.includes('Bagaimana memilah botol plastik?'), true);
      for (const removedIdentity of [
        'Irdan Guntara',
        'Galih Rizaldy',
        'Ema Maleni',
        'Nayarah Atmawardani',
        'Ryan Dwi Antoni',
        'Gisca Oktavia Ramadhani',
        'CC26-PSU246',
        'Tim pengembang',
      ]) {
        assert.equal(body.contents[0].parts[0].text.includes(removedIdentity), false);
      }

      return {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Cuci botol, pisahkan tutupnya, lalu masukkan ke sampah anorganik.' }],
              },
            },
          ],
        }),
      };
    },
  });

  assert.equal(reply, 'Cuci botol, pisahkan tutupnya, lalu masukkan ke sampah anorganik.');
});

test('reports a friendly error when Gemini returns no text', async () => {
  await assert.rejects(
    () => createChatbotReply({
      message: 'Apa itu sampah organik?',
      apiKey: 'test-key',
      fetchFn: async () => ({
        ok: true,
        json: async () => ({ candidates: [] }),
      }),
    }),
    /Gemini tidak mengembalikan jawaban/
  );
});
