import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'node:fs';

const UPLOAD_DIR = os.tmpdir();

// No need to manually ensure /tmp exists, but let's keep the variable for consistency

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const extension = path.extname(file.originalname || '').toLowerCase();
  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(extension)) {
    const error = new Error('File harus berupa gambar JPEG, PNG, atau WebP.');
    error.status = 400;
    cb(error, false);
    return;
  }
  cb(null, true);
};

export const validateImageMagicBytes = async (filePathOrBuffer) => {
  let buffer;
  try {
    if (Buffer.isBuffer(filePathOrBuffer)) buffer = filePathOrBuffer;
    else if (typeof filePathOrBuffer === 'string') {
      const fs = await import('node:fs/promises');
      buffer = await fs.readFile(filePathOrBuffer);
    } else return false;
  } catch {
    return false;
  }

  if (buffer.length >= 3 &&
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  if (buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true;
  if (buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP') return true;
  return false;
};

export const sweepStaleUploadFiles = () => {
  fs.readdir(UPLOAD_DIR, (readError, entries) => {
    if (readError) return;
    const cutoff = Date.now() - 60 * 60 * 1000;
    for (const entry of entries) {
      if (!entry.startsWith('image-')) continue;
      const filePath = path.join(UPLOAD_DIR, entry);
      fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile() || stats.mtimeMs >= cutoff) return;
        fs.unlink(filePath, () => {});
      });
    }
  });
};

// Best-effort startup cleanup without blocking server startup.
sweepStaleUploadFiles();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

export default upload;
