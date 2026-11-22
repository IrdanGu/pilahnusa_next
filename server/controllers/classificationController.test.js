import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import sharp from 'sharp';
import HistoryModel from '../models/HistoryModel.js';
import { tfHelper } from '../utils/tfHelper.js';
import { classifyWaste, __resetModelForTesting } from './classificationController.js';

test.describe('classificationController - classifyWaste', () => {
  // Preserve original methods
  const originalLoadGraphModel = tfHelper.loadGraphModel;
  const originalTensor4d = tfHelper.tensor4d;
  const originalReadFileSync = fs.readFileSync;
  const originalStatSync = fs.statSync;
  const originalUnlink = fs.unlink;
  const originalHistoryAdd = HistoryModel.add;

  const originalSharpResize = sharp.prototype.resize;
  const originalSharpJpeg = sharp.prototype.jpeg;
  const originalSharpRemoveAlpha = sharp.prototype.removeAlpha;
  const originalSharpRaw = sharp.prototype.raw;
  const originalSharpToBuffer = sharp.prototype.toBuffer;

  test.beforeEach(() => {
    __resetModelForTesting();
  });

  test.afterEach(() => {
    __resetModelForTesting();
    // Restore all mocked methods
    tfHelper.loadGraphModel = originalLoadGraphModel;
    tfHelper.tensor4d = originalTensor4d;
    fs.readFileSync = originalReadFileSync;
    fs.statSync = originalStatSync;
    fs.unlink = originalUnlink;
    HistoryModel.add = originalHistoryAdd;

    sharp.prototype.resize = originalSharpResize;
    sharp.prototype.jpeg = originalSharpJpeg;
    sharp.prototype.removeAlpha = originalSharpRemoveAlpha;
    sharp.prototype.raw = originalSharpRaw;
    sharp.prototype.toBuffer = originalSharpToBuffer;
  });

  test('returns 400 if no image file is provided', async () => {
    const req = { file: undefined };
    let statusValue = null;
    let jsonValue = null;

    const res = {
      status(code) {
        statusValue = code;
        return this;
      },
      json(data) {
        jsonValue = data;
        return this;
      }
    };

    const next = () => {};

    await classifyWaste(req, res, next);

    assert.equal(statusValue, 400);
    assert.deepEqual(jsonValue, { error: 'No image file provided for classification' });
  });

  test('rejects a zero-byte uploaded file as invalid magic bytes', async () => {
    fs.statSync = () => ({ isFile: () => true, size: 0 });
    fs.readFileSync = () => Buffer.alloc(0);
    fs.unlink = (path, cb) => cb(null);

    const req = { file: { path: 'zero-byte.jpg' } };
    let statusValue = null;
    let jsonValue = null;
    const res = {
      status(code) { statusValue = code; return this; },
      json(data) { jsonValue = data; return this; },
    };

    await classifyWaste(req, res, () => {});

    assert.equal(statusValue, 400);
    assert.deepEqual(jsonValue, { error: 'File bukan gambar JPEG/PNG/WebP yang valid.' });
  });

  test('successfully classifies an image (Happy Path)', async () => {
    // 1. Mock fs statSync, readFileSync (valid JPEG header), and unlink
    fs.statSync = () => ({ isFile: () => true, size: 16 });
    fs.readFileSync = () => Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
    let fileUnlinked = false;
    fs.unlink = (path, cb) => {
      fileUnlinked = true;
      cb(null);
    };

    // 2. Mock HistoryModel.add
    let historySaved = null;
    HistoryModel.add = (item) => {
      historySaved = item;
      return item;
    };

    // 3. Mock sharp prototype methods
    sharp.prototype.resize = function () { return this; };
    sharp.prototype.jpeg = function () { return this; };
    sharp.prototype.removeAlpha = function () { return this; };
    sharp.prototype.raw = function () { return this; };
    sharp.prototype.toBuffer = async function (options) {
      if (options && options.resolveWithObject) {
        return {
          data: Buffer.alloc(224 * 224 * 3),
          info: { width: 224, height: 224, channels: 3 }
        };
      }
      return Buffer.from('fake-thumbnail-base64');
    };

    // 4. Mock TensorFlow via tfHelper
    let inputTensorDisposed = false;
    let outputTensorDisposed = false;

    const fakeInputTensor = {
      dispose() { inputTensorDisposed = true; }
    };
    tfHelper.tensor4d = () => fakeInputTensor;

    const fakeOutputTensor = {
      async data() {
        // Return 10 probabilities where index 1 (Kaca) has highest probability (0.95)
        return new Float32Array([0.01, 0.95, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01]);
      },
      dispose() { outputTensorDisposed = true; }
    };

    const fakeModel = {
      execute() {
        return fakeOutputTensor;
      }
    };
    tfHelper.loadGraphModel = async () => fakeModel;

    // 5. Mock request, response, and next
    const req = {
      file: { path: 'dummy-path.jpg' }
    };

    let statusValue = null;
    let jsonValue = null;

    const res = {
      status(code) {
        statusValue = code;
        return this;
      },
      json(data) {
        jsonValue = data;
        return this;
      }
    };

    const next = () => {};

    // 6. Run the handler
    await classifyWaste(req, res, next);

    // 7. Assert results
    assert.equal(statusValue, 200);
    assert.ok(jsonValue.id);
    assert.ok(jsonValue.timestamp);
    assert.equal(jsonValue.imageBase64, 'data:image/jpeg;base64,' + Buffer.from('fake-thumbnail-base64').toString('base64'));
    assert.equal(jsonValue.result.name, 'Kaca');
    assert.equal(jsonValue.result.category, 'anorganik');
    assert.equal(jsonValue.result.confidence, 95);
    
    // Verify cleanup
    assert.equal(fileUnlinked, true);
    assert.equal(inputTensorDisposed, true);
    assert.equal(outputTensorDisposed, true);
    assert.ok(historySaved);
  });

  test('cleans up image and handles preprocessing errors safely', async () => {
    // 1. Mock sharp to throw an error during raw buffering
    sharp.prototype.resize = function () { return this; };
    sharp.prototype.removeAlpha = function () { return this; };
    sharp.prototype.raw = function () { return this; };
    sharp.prototype.toBuffer = async function (options) {
      if (options && options.resolveWithObject) {
        throw new Error('Sharp processing failed');
      }
      return Buffer.from('thumbnail');
    };

    // 2. Mock fs statSync, unlink and readFileSync (valid JPEG header)
    fs.statSync = () => ({ isFile: () => true, size: 16 });
    fs.readFileSync = () => Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
    let fileUnlinked = false;
    fs.unlink = (path, cb) => {
      fileUnlinked = true;
      if (cb) cb(null);
    };

    tfHelper.loadGraphModel = async () => ({});

    const req = {
      file: { path: 'dummy-path.jpg' }
    };

    let errorPassedToNext = null;
    const next = (err) => {
      errorPassedToNext = err;
    };

    const res = {};

    // 3. Run and assert error propagation
    await classifyWaste(req, res, next);

    assert.ok(errorPassedToNext);
    assert.equal(errorPassedToNext.message, 'Sharp processing failed');
    assert.equal(fileUnlinked, true);
  });

  test('cleans up image and handles inference errors safely', async () => {
    // 1. Mock fs statSync, readFileSync (valid JPEG header), and unlink
    fs.statSync = () => ({ isFile: () => true, size: 16 });
    fs.readFileSync = () => Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
    let fileUnlinked = false;
    fs.unlink = (path, cb) => {
      fileUnlinked = true;
      if (cb) cb(null);
    };

    // 2. Mock sharp methods to succeed
    sharp.prototype.resize = function () { return this; };
    sharp.prototype.jpeg = function () { return this; };
    sharp.prototype.removeAlpha = function () { return this; };
    sharp.prototype.raw = function () { return this; };
    sharp.prototype.toBuffer = async function (options) {
      if (options && options.resolveWithObject) {
        return {
          data: Buffer.alloc(224 * 224 * 3),
          info: { width: 224, height: 224, channels: 3 }
        };
      }
      return Buffer.from('thumbnail');
    };

    // 3. Mock TensorFlow via tfHelper to throw error during execute
    let inputTensorDisposed = false;
    const fakeInputTensor = {
      dispose() { inputTensorDisposed = true; }
    };
    tfHelper.tensor4d = () => fakeInputTensor;

    const fakeModel = {
      execute() {
        throw new Error('TFJS Inference Failed');
      }
    };
    tfHelper.loadGraphModel = async () => fakeModel;

    const req = {
      file: { path: 'dummy-path.jpg' }
    };

    let errorPassedToNext = null;
    const next = (err) => {
      errorPassedToNext = err;
    };

    const res = {};

    // 4. Run handler
    await classifyWaste(req, res, next);

    // 5. Assert error and guaranteed tensor cleanup
    assert.ok(errorPassedToNext);
    assert.equal(errorPassedToNext.message, 'TFJS Inference Failed');
    assert.equal(fileUnlinked, true);
    assert.equal(inputTensorDisposed, true); // Tensor must be disposed even if inference failed
  });
});
