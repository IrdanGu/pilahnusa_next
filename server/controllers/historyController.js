import HistoryModel from '../models/HistoryModel.js';

const getUserId = (req) => req.headers['x-user-id']?.trim();

const validateHistoryPayload = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const allowedTopLevel = new Set(['id', 'timestamp', 'date', 'result', 'imageUrl']);
  if (Object.keys(body).some((key) => !allowedTopLevel.has(key))) return null;

  if (typeof body.id !== 'string' || body.id.length === 0 || body.id.length > 64) return null;

  if (body.timestamp !== undefined &&
    (typeof body.timestamp !== 'string' || body.timestamp.length > 64)) return null;
  if (body.date !== undefined &&
    (typeof body.date !== 'string' || body.date.length > 64)) return null;

  if (!body.result || typeof body.result !== 'object' || Array.isArray(body.result)) return null;
  const resultKeys = Object.keys(body.result);
  if (!resultKeys.every((key) => ['name', 'category', 'confidence'].includes(key))) return null;
  const { name, category, confidence } = body.result;
  if (typeof name !== 'string' || name.length === 0 || name.length > 100) return null;
  if (typeof category !== 'string' || category.length === 0 || category.length > 50) return null;
  if (typeof confidence !== 'number' || !Number.isFinite(confidence) ||
      confidence < 0 || confidence > 100) return null;

  let safeImageUrl;
  if (body.imageUrl !== undefined) {
    if (typeof body.imageUrl !== 'string' || body.imageUrl.length > 256 ||
        /^data:/i.test(body.imageUrl)) return null;
    safeImageUrl = body.imageUrl;
  }

  return {
    id: body.id,
    ...(body.timestamp !== undefined ? { timestamp: body.timestamp } : {}),
    ...(body.date !== undefined ? { date: body.date } : {}),
    result: { name, category, confidence },
    ...(safeImageUrl !== undefined ? { imageUrl: safeImageUrl } : {}),
  };
};

export const getHistory = (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'Header X-User-Id wajib disertakan.' });
    const history = HistoryModel.getAll(userId);
    return res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
};

export const addHistoryItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'Header X-User-Id wajib disertakan.' });
    const payload = validateHistoryPayload(req.body);
    if (!payload) return res.status(400).json({ error: 'Payload riwayat tidak valid.' });
    const newItem = await HistoryModel.add(payload, userId);
    return res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add history item' });
  }
};

export const deleteHistoryItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: 'Header X-User-Id wajib disertakan.' });
    const { id } = req.params;
    const success = await HistoryModel.delete(id, userId);
    if (success) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history item' });
  }
};
