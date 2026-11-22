import axios from 'axios';

const mapClassificationError = (error) => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Koneksi terlalu lama. Periksa jaringan lalu coba lagi.';
  }
  if (!error.response) return 'Anda sedang offline atau server tidak dapat dijangkau. Periksa koneksi internet.';
  const status = error.response.status;
  if (status === 429) return 'Terlalu banyak permintaan. Tunggu beberapa saat lalu coba lagi.';
  if (status === 413) return 'Ukuran gambar terlalu besar. Gunakan gambar di bawah 10 MB.';
  if (status === 400) return 'Gambar atau permintaan tidak valid. Pilih foto sampah yang jelas.';
  if (status >= 500) return 'Layanan AI sedang bermasalah. Silakan coba lagi sebentar.';
  return error.response?.data?.error || 'Gagal memproses gambar. Silakan coba lagi.';
};

/**
 * Classify waste from a base64-encoded image using the Express backend
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<Object>} Classification result
 */
export const classifyWaste = async (base64Image) => {
  try {
    // Convert raw base64 to Blob securely
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Create FormData
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');

    // Send to backend
    const response = await axios.post('/api/classifications', formData, {
      timeout: 30000,
      headers: {
        'X-User-Id': (typeof localStorage !== 'undefined' && localStorage.getItem('bilahbeu_user_id')) || 'anonymous',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error classifying waste:', error);
    throw new Error(mapClassificationError(error));
  }
};

/**
 * Compatibility export for existing code
 */
export const mockClassifyWaste = classifyWaste;

