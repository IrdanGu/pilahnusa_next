import express from 'express';
import upload from '../middleware/upload.js';
import { classifyWaste } from '../controllers/classificationController.js';
import { getHistory, addHistoryItem, deleteHistoryItem } from '../controllers/historyController.js';
import { chatWithWasteAssistant } from '../controllers/chatbotController.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import { isModelReady } from '../controllers/classificationController.js';

const router = express.Router();

const classificationLimiter = createRateLimiter({ windowMs: 60_000, max: 15, message: 'Terlalu banyak permintaan klasifikasi. Silakan coba lagi sebentar lagi.' });
const chatbotLimiter = createRateLimiter({ windowMs: 60_000, max: 15, message: 'Terlalu banyak permintaan chatbot. Silakan coba lagi sebentar lagi.' });
const apiLimiter = createRateLimiter({ windowMs: 60_000, max: 120, message: 'Terlalu banyak permintaan ke server. Silakan coba lagi sebentar lagi.' });

router.use(apiLimiter);
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    modelReady: isModelReady(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
  });
});

// Classification route
router.post('/classifications', classificationLimiter, upload.single('image'), classifyWaste);

// Chatbot route
router.post('/chatbot', chatbotLimiter, chatWithWasteAssistant);

// History routes
router.get('/history', getHistory);
router.post('/history', addHistoryItem);
router.delete('/history/:id', deleteHistoryItem);

export default router;
