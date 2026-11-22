import test from 'node:test';
import assert from 'node:assert/strict';
import multer from 'multer';
import { errorHandler } from './errorHandler.js';

const mockResponse = () => ({
  statusCode: null,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test('maps multer file size to 413', () => {
  const res = mockResponse();
  errorHandler(new multer.MulterError('LIMIT_FILE_SIZE'), {}, res, () => {});
  assert.equal(res.statusCode, 413);
});

test('maps JSON parse and payload errors', () => {
  const parseRes = mockResponse();
  errorHandler({ type: 'entity.parse.failed', status: 400, message: 'bad' }, {}, parseRes, () => {});
  assert.equal(parseRes.statusCode, 400);

  const largeRes = mockResponse();
  errorHandler({ type: 'entity.too.large', status: 413, message: 'large' }, {}, largeRes, () => {});
  assert.equal(largeRes.statusCode, 413);
});

test('delegates errors after headers are sent', () => {
  let delegated;
  const res = { headersSent: true };
  errorHandler(new Error('late'), {}, res, (error) => { delegated = error; });
  assert.equal(delegated?.message, 'late');
});

test('redacts production 500 responses', () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const res = mockResponse();
  errorHandler(Object.assign(new Error('secret'), { status: 500 }), {}, res, () => {});
  assert.equal(res.statusCode, 500);
  assert.equal(res.body.error, 'Terjadi kesalahan pada server.');
  if (previous === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previous;
});
