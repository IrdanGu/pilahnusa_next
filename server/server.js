import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { securityHeaders } from './middleware/securityHeaders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(securityHeaders);

const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (corsOrigin?.length) return callback(null, corsOrigin.includes(origin));
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, /^https?:\/\/(?:localhost|127\.0\.0\.1):(?:5173|4173|5000)$/i.test(origin));
    }
    console.warn('[CORS] Production origin rejected: CORS_ORIGIN is unset');
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Routes
app.use('/api', apiRoutes);

app.use('/api/*splat', (_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint API tidak ditemukan.' });
});

// Error Handling Middleware
app.use(errorHandler);

let server;
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  const shutdown = (signal) => {
    console.log(`[Server] Received ${signal}, shutting down gracefully.`);
    server.close(() => process.exit(0));
  };
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

export default app;
