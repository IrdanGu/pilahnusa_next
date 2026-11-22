// In-memory sliding-window rate limiter.
// Keys requests by client IP and prunes expired hits on an unref'd timer
// so the process (and node:test runs) can exit cleanly.

export const createRateLimiter = ({
  windowMs = 60_000,
  max = 60,
  maxKeys = 10_000,
  message = 'Terlalu banyak permintaan. Silakan coba lagi nanti.',
} = {}) => {
  // key -> array of request timestamps inside the current window
  const hits = new Map();

  const prune = () => {
    const now = Date.now();
    for (const [key, timestamps] of hits) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, valid);
      }
    }
  };

  const pruneTimer = setInterval(prune, windowMs);
  // Never keep the Node process alive just for pruning.
  if (typeof pruneTimer.unref === 'function') {
    pruneTimer.unref();
  }

  const normalizeIp = (value) => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const unwrapped = trimmed.startsWith('[') && trimmed.includes(']')
      ? trimmed.slice(1, trimmed.indexOf(']'))
      : trimmed;
    return unwrapped.startsWith('::ffff:')
      ? unwrapped.slice(7)
      : unwrapped;
  };

  return (req, res, next) => {
    // Tests can opt in explicitly with the x-test-rate-limit header.
    if (process.env.NODE_ENV === 'test' && !req.headers?.['x-test-rate-limit']) {
      return next();
    }

    const forwarded = req.headers?.['x-forwarded-for'];
    let key;
    if (typeof forwarded === 'string') {
      const entries = forwarded.split(',').map(normalizeIp).filter(Boolean);
      key = entries.at(-1);
    }
    key = key || normalizeIp(req.socket?.remoteAddress) || normalizeIp(req.ip) || 'unknown';
    const now = Date.now();
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((timestamps[0] + windowMs - now) / 1000));
      if (typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', String(retryAfterSeconds));
      } else if (typeof res.set === 'function') {
        res.set('Retry-After', String(retryAfterSeconds));
      }
      return res.status(429).json({ success: false, error: message });
    }

    timestamps.push(now);
    if (!hits.has(key) && hits.size >= maxKeys) {
      const oldestKey = hits.keys().next().value;
      if (oldestKey !== undefined) hits.delete(oldestKey);
    }
    hits.delete(key);
    hits.set(key, timestamps);
    next();
  };
};

export default createRateLimiter;
