import test from 'node:test';
import assert from 'node:assert/strict';
import { createRateLimiter } from './rateLimiter.js';

test('rate limiter allows then rejects requests and sets Retry-After', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 1, message: 'Dibatasi' });
  const req = { ip: '127.0.0.1', headers: { 'x-test-rate-limit': '1' } };
  let nextCount = 0;
  assert.equal(limiter(req, { setHeader() {}, status() { return this; }, json() {} }, () => { nextCount++; }), undefined);
  assert.equal(nextCount, 1);

  let statusCode;
  let body;
  limiter(req, {
    setHeader() {},
    status(code) { statusCode = code; return this; },
    json(value) { body = value; return this; },
  }, () => {});
  assert.equal(statusCode, 429);
  assert.equal(body.error, 'Dibatasi');
});

test('uses the rightmost XFF entry and normalizes IPv4-mapped addresses', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 10, maxKeys: 10 });
  const seenKeys = [];
  const res = () => ({
    setHeader() {},
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  });

  limiter({
    headers: { 'x-test-rate-limit': '1', 'x-forwarded-for': '203.0.113.1, ::ffff:127.0.0.1' },
    socket: { remoteAddress: '10.0.0.1' },
  }, res(), () => { seenKeys.push('allowed'); });
  limiter({
    headers: { 'x-test-rate-limit': '1', 'x-forwarded-for': '198.51.100.2, ::ffff:127.0.0.1' },
    socket: { remoteAddress: '10.0.0.2' },
  }, res(), () => { seenKeys.push('allowed'); });

  assert.equal(seenKeys.length, 2);
});

test('evicts the oldest key when maxKeys is reached', () => {
  const limiter = createRateLimiter({ windowMs: 60_000, max: 1, maxKeys: 2 });
  const request = (ip) => ({
    ip,
    headers: { 'x-test-rate-limit': '1' },
  });
  const response = () => ({
    setHeader() {},
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  });

  let nextCount = 0;
  const next = () => { nextCount++; };
  limiter(request('a'), response(), next);
  limiter(request('b'), response(), next);
  limiter(request('c'), response(), next);
  limiter(request('a'), response(), next);
  assert.equal(nextCount, 4);
});
