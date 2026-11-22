import test from 'node:test';
import assert from 'node:assert/strict';
import HistoryModel from './HistoryModel.js';

test('history is scoped and strips imageBase64', async () => {
  await HistoryModel.clear('user-a');
  await HistoryModel.clear('user-b');
  await HistoryModel.add({ id: 'a1', result: { name: 'Kaca' }, imageBase64: 'secret-image' }, 'user-a');
  await HistoryModel.add({ id: 'b1', result: { name: 'Plastik' } }, 'user-b');

  const a = HistoryModel.getAll('user-a');
  const b = HistoryModel.getAll('user-b');
  assert.equal(a.length, 1);
  assert.equal(a[0].id, 'a1');
  assert.equal('imageBase64' in a[0], false);
  assert.equal(b.length, 1);
  assert.equal(b[0].id, 'b1');

  await HistoryModel.clear('user-a');
  await HistoryModel.clear('user-b');
});

test('concurrent adds persist all 10 items', async () => {
  await HistoryModel.clear('race-user');
  await Promise.all(Array.from({ length: 10 }, (_, index) =>
    HistoryModel.add({ id: `race-${index}`, result: { name: `Item ${index}` } }, 'race-user')
  ));
  assert.equal(HistoryModel.getAll('race-user').length, 10);
  await HistoryModel.clear('race-user');
});

test('caps history at 50 per user and 200 globally', async () => {
  await HistoryModel.clear('cap-a');
  await HistoryModel.clear('cap-b');
  await Promise.all(Array.from({ length: 55 }, (_, index) =>
    HistoryModel.add({ id: `a-${index}` }, 'cap-a')
  ));
  assert.equal(HistoryModel.getAll('cap-a').length, 50);

  await Promise.all(Array.from({ length: 155 }, (_, index) =>
    HistoryModel.add({ id: `b-${index}` }, 'cap-b')
  ));
  assert.equal(HistoryModel._readAll().length <= 200, true);
  await HistoryModel.clear('cap-a');
  await HistoryModel.clear('cap-b');
});
