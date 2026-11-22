import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/history.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(DATA_FILE);
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  } catch (error) {
    if (error.code !== 'EROFS') console.error('Error initializing history data:', error);
  }
};

export class HistoryModel {
  constructor() {
    ensureDataDir();
    this.writeQueue = Promise.resolve();
  }

  getAll(userId) {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const history = JSON.parse(data);
      if (!userId) return [];
      return history
        .filter((item) => item.userId === userId)
        .map(({ imageBase64: _imageBase64, ...item }) => item)
        .slice(0, 50);
    } catch (error) {
      console.error('Error reading history data:', error);
      return [];
    }
  }

  async _writeDisk(data) {
    const payload = JSON.stringify(data, null, 2);
    const tmpFile = `${DATA_FILE}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`;
    try {
      await fs.promises.writeFile(tmpFile, payload);
      let renamed = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await fs.promises.rename(tmpFile, DATA_FILE);
          renamed = true;
          break;
        } catch (renameErr) {
          if ((renameErr.code === 'EPERM' || renameErr.code === 'EBUSY') && attempt < 4) {
            await new Promise((resolve) => setTimeout(resolve, 15 * (attempt + 1)));
            continue;
          }
          throw renameErr;
        }
      }
      return renamed;
    } catch (error) {
      try { await fs.promises.unlink(tmpFile); } catch { /* ignore */ }
      if (error.code !== 'EROFS') console.error('Error saving history data:', error);
      return false;
    }
  }

  async saveAll(data) {
    const write = () => this._writeDisk(data);
    this.writeQueue = this.writeQueue.then(write, write);
    return this.writeQueue;
  }

  async add(item, userId) {
    const operation = async () => {
      const allHistory = this._readAll();
      const persistedItem = {
        ...item,
        userId: userId || 'anonymous',
        imageBase64: undefined,
      };
      delete persistedItem.imageBase64;
      allHistory.unshift(persistedItem);
      const byUser = new Map();
      const capped = allHistory.filter((entry) => {
        const count = byUser.get(entry.userId) || 0;
        if (count >= 50) return false;
        byUser.set(entry.userId, count + 1);
        return true;
      }).slice(0, 200);

      await this._writeDisk(capped);
      return true;
    };
    this.writeQueue = this.writeQueue.then(operation, operation);
    await this.writeQueue;
    return { ...item, userId: userId || 'anonymous' };
  }

  _readAll() {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      return [];
    }
  }

  async delete(id, userId) {
    if (!userId) return false;
    const operation = async () => {
      const allHistory = this._readAll();
      const newHistory = allHistory.filter((item) =>
        !(item.id === id && item.userId === userId)
      );
      if (newHistory.length < allHistory.length) {
        await this._writeDisk(newHistory);
        return true;
      }
      return false;
    };
    this.writeQueue = this.writeQueue.then(operation, operation);
    return this.writeQueue;
  }

  async clear(userId) {
    if (!userId) return false;
    const operation = async () => {
      const remaining = this._readAll().filter((item) => item.userId !== userId);
      await this._writeDisk(remaining);
      return true;
    };
    this.writeQueue = this.writeQueue.then(operation, operation);
    return this.writeQueue;
  }
}

export default new HistoryModel();
