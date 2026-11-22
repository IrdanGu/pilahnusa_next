/**
 * Image utility functions for compression and conversion
 */

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
const QUALITY = 0.75;
const THUMBNAIL_SIZE = 120;

/**
 * Convert a File object to a base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded image data (without prefix)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert a File object to a data URL (with prefix)
 * @param {File} file - Image file
 * @returns {Promise<string>} Data URL
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Compress an image and return base64 data
 * @param {string} dataUrl - Original image data URL
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - JPEG quality (0–1)
 * @returns {Promise<{base64: string, dataUrl: string}>}
 */
export const compressImage = (dataUrl, maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT, quality = QUALITY) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Gagal memuat gambar. Pastikan file tidak rusak.'));
    img.onload = () => {
      let { width, height } = img;

      // Calculate resize dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      const base64 = compressedDataUrl.split(',')[1];

      resolve({ base64, dataUrl: compressedDataUrl });
    };
    img.src = dataUrl;
  });
};

/**
 * Create a thumbnail from an image data URL
 * @param {string} dataUrl - Original image data URL
 * @returns {Promise<string>} Thumbnail data URL
 */
export const createThumbnail = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('Gagal memuat gambar. Pastikan file tidak rusak.'));
    img.onload = () => {
      const size = THUMBNAIL_SIZE;
      const ratio = Math.max(size / img.width, size / img.height);
      const sw = img.width;
      const sh = img.height;
      const dw = Math.min(img.width, size / ratio);
      const dh = Math.min(img.height, size / ratio);

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        (sw - dw) / 2, (sh - dh) / 2, dw, dh,
        0, 0, size, size
      );

      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.src = dataUrl;
  });
};

/**
 * Convert canvas to base64
 * @param {HTMLCanvasElement} canvas
 * @returns {{base64: string, dataUrl: string}}
 */
export const canvasToBase64 = (canvas) => {
  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
  const base64 = dataUrl.split(',')[1];
  return { base64, dataUrl };
};

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'Pilih file gambar terlebih dahulu.' };
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { valid: false, error: 'Format tidak didukung. Gunakan JPG, PNG, atau WebP.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Ukuran gambar maksimal 10 MB.' };
  }
  return { valid: true, error: null };
};

export const urlToDataUrl = (url) => new Promise((resolve, reject) => {
  if (!url) { reject(new Error('URL gambar tidak tersedia.')); return; }
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error('Gagal memuat gambar sampel.');
      return response.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Gagal memuat gambar. Pastikan file tidak rusak.'));
      reader.readAsDataURL(blob);
    })
    .catch((error) => reject(error instanceof Error ? error : new Error('Gagal memuat gambar sampel.')));
});
