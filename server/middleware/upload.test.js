import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateImageMagicBytes } from './upload.js';

test('accepts JPEG PNG and WebP magic bytes', async () => {
  assert.equal(await validateImageMagicBytes(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), true);
  assert.equal(await validateImageMagicBytes(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), true);
  const webp = Buffer.from('RIFF0000WEBP', 'ascii');
  assert.equal(await validateImageMagicBytes(webp), true);
});

test('rejects spoofed files', async () => {
  assert.equal(await validateImageMagicBytes(Buffer.from('plain text')), false);
  const tempFile = path.join(os.tmpdir(), `bilahbeu-invalid-${process.pid}.bin`);
  fs.writeFileSync(tempFile, 'not an image');
  assert.equal(await validateImageMagicBytes(tempFile), false);
  fs.unlinkSync(tempFile);
});
