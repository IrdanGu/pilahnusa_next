import fetch from 'node-fetch';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

class ChatbotError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const buildWasteAssistantPrompt = (message) => `
Anda adalah asisten edukasi PilahNusa AI yang membantu masyarakat Indonesia memahami pengelolaan sampah dan cara penggunaan aplikasi PilahNusa AI.

Informasi Penting Aplikasi PilahNusa AI:
1. Langkah Penggunaan Utama:
   - Akses PilahNusa AI melalui peramban (browser). Di halaman Beranda, sambutan edukasi berbunyi "Scan sampahmu dan pelajari cara pengelolaannya".
   - Pilih Metode Pemindaian dengan menekan tombol:
     * "Scan Sekarang" untuk membuka kamera langsung dan memotret objek sampah.
     * "Upload dari Galeri" untuk memilih foto sampah statis dari penyimpanan perangkat.
   - Hasil & Panduan Edukasi yang akan ditampilkan meliputi:
     * Kategori Sampah (Organik, Anorganik, B3) beserta nama klasifikasinya (contoh: "Sisa buah dan sayur").
     * Tingkat Keyakinan AI (Confidence Level) dalam bentuk persentase.
     * Waktu Terurai di alam (contoh: 1-4 minggu).
     * Cara Pembuangan dan tips daur ulang yang tepat.
   - Navigasi Riwayat: Pengguna dapat menuju menu "Riwayat" di navigasi bawah untuk meninjau kembali riwayat hasil pemindaian sampah sebelumnya.
2. Tips Pemotretan / Deteksi Paling Akurat:
   - Pastikan pencahayaan cukup terang saat memotret objek.
   - Fokuskan kamera hanya pada satu jenis sampah dalam satu bingkai.
   - Hindari latar belakang (background) yang terlalu ramai.
   - Pastikan foto tajam dan tidak kabur (blur).
Aturan Menjawab:
- Berikan jawaban yang SINGKAT, PADAT, dan JELAS langsung ke inti pertanyaan.
- Gunakan poin-poin (bullet points) atau daftar ringkas agar sangat mudah dibaca.
- Selalu hapus dan jangan pernah gunakan simbol format tambahan atau markdown seperti tanda bintang (*) atau bintang ganda (**) untuk menebalkan atau memiringkan kata. Sampaikan jawaban dalam bentuk teks polos (plain text) yang bersih tanpa simbol pemformatan tersebut.
- Hanya jawab pertanyaan seputar pengelolaan/pemilahan sampah atau penggunaan/tips aplikasi PilahNusa AI.
- Jika ditanya di luar topik di atas, jawab dengan sopan bahwa Anda adalah asisten edukasi PilahNusa AI dan hanya melayani edukasi pemilahan sampah serta aplikasi PilahNusa AI.
- Jangan mengarang lokasi drop-point spesifik. Sarankan mengecek bank sampah terdekat atau DLH setempat.

Pertanyaan pengguna:
${message}
`.trim();

const extractGeminiText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';

  return parts
    .map((part) => part?.text || '')
    .join('\n')
    .trim();
};

export const createChatbotReply = async ({
  message,
  apiKey = process.env.GEMINI_API_KEY,
  fetchFn = fetch,
}) => {
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedMessage) {
    throw new ChatbotError('Pertanyaan tidak boleh kosong.', 400);
  }

  if (!apiKey) {
    throw new ChatbotError('GEMINI_API_KEY belum dikonfigurasi di server.', 500);
  }

  const response = await fetchFn(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildWasteAssistantPrompt(trimmedMessage) }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 700,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const messageFromApi = data?.error?.message || 'Gemini gagal memproses pertanyaan.';
    throw new ChatbotError(messageFromApi, response.status || 502);
  }

  const reply = extractGeminiText(data);
  if (!reply) {
    throw new ChatbotError('Gemini tidak mengembalikan jawaban. Silakan coba lagi.', 502);
  }

  return reply;
};

export const chatWithWasteAssistant = async (req, res, next) => {
  try {
    const reply = await createChatbotReply({ message: req.body?.message });
    return res.status(200).json({ reply });
  } catch (error) {
    if (error instanceof ChatbotError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return next(error);
  }
};
