import test from 'node:test';
import assert from 'node:assert/strict';
import HistoryModel from '../models/HistoryModel.js';
import { getHistory, addHistoryItem, deleteHistoryItem } from './historyController.js';

const mockResponse = () => ({
  statusCode: null,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test('history rejects missing x-user-id', async () => {
  const res = mockResponse();
  await getHistory({ headers: {} }, res);
  assert.equal(res.statusCode, 400);

  await addHistoryItem({ headers: {}, body: {} }, res);
  assert.equal(res.statusCode, 400);
});

test('history rejects invalid payload fields', async () => {
  const originalAdd = HistoryModel.add;
  let called = false;
  HistoryModel.add = async () => { called = true; };
  try {
    const res = mockResponse();
    await addHistoryItem({
      headers: { 'x-user-id': 'user-a' },
      body: {
        id: 'item-1',
        imageBase64: 'secret',
        result: { name: 'Kaca', category: 'anorganik', confidence: 90, extra: true },
      },
    }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(called, false);

    const dataUriRes = mockResponse();
    await addHistoryItem({
      headers: { 'x-user-id': 'user-a' },
      body: {
        id: 'item-1',
        imageUrl: 'data:image/png;base64,AAAA',
        result: { name: 'Kaca', category: 'anorganik', confidence: 90 },
      },
    }, dataUriRes);
    assert.equal(dataUriRes.statusCode, 400);
  } finally {
    HistoryModel.add = originalAdd;
  }
});

test('history supports valid add, get, and scoped delete', async () => {
  await HistoryModel.clear('controller-user');
  const addRes = mockResponse();
  await addHistoryItem({
    headers: { 'x-user-id': 'controller-user' },
    body: {
      id: 'controller-item',
      timestamp: '2026-11-21T10:00:00.000Z',
      result: { name: 'Kaca', category: 'anorganik', confidence: 95 },
    },
  }, addRes);
  assert.equal(addRes.statusCode, 201);

  const getRes = mockResponse();
  getHistory({ headers: { 'x-user-id': 'controller-user' } }, getRes);
  assert.equal(getRes.statusCode, 200);
  assert.equal(getRes.body[0].id, 'controller-item');

  const deleteRes = mockResponse();
  await deleteHistoryItem({
    headers: { 'x-user-id': 'controller-user' },
    params: { id: 'controller-item' },
  }, deleteRes);
  assert.equal(deleteRes.statusCode, 200);
  await HistoryModel.clear('controller-user');
});
