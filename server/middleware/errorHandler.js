import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error('Error:', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Ukuran file terlalu besar. Maksimal 10MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Field upload tidak valid atau file tidak diizinkan.' });
    }
    return res.status(400).json({ error: 'Permintaan upload tidak valid.' });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Format JSON pada permintaan tidak valid.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Ukuran permintaan terlalu besar.' });
  }

  const statusCode = err.status || err.statusCode || 500;
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    return res.status(statusCode).json({ error: 'Terjadi kesalahan pada server.' });
  }
  return res.status(statusCode).json({
    error: err.message || 'Terjadi kesalahan pada server.',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
};
