import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getImpactLedger, recordImpactScan, resetImpactLedger, saveHistoryItemWithMeta } from './storageUtils';

beforeEach(() => {
  localStorage.clear();
  resetImpactLedger();
});

describe('storage impact ledger', () => {
  it('records scans and category totals', () => {
    const item = { id: '1', timestamp: '2026-11-21T10:00:00.000Z', result: { category: 'Anorganik' } };
    const ledger = recordImpactScan(item);
    expect(ledger.totalScans).toBe(1);
    expect(ledger.totalPoints).toBe(15);
    expect(ledger.categoryCounts.Anorganik).toBe(1);
  });

  it('backfills a ledger from history', () => {
    localStorage.removeItem('bilahbeu_impact_ledger');
    localStorage.setItem('bilahbeu_history', JSON.stringify([
      { id: '1', timestamp: '2026-11-21T10:00:00.000Z', result: { category: 'Organik' } },
    ]));
    expect(getImpactLedger().totalScans).toBe(1);
  });

  it('preserves the newest scan when storage quota is exceeded', () => {
    const originalSetItem = Storage.prototype.setItem;
    let calls = 0;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      calls += 1;
      if (calls <= 2) throw new DOMException('quota', 'QuotaExceededError');
      return originalSetItem.call(this, key, value);
    });
    const result = saveHistoryItemWithMeta({ id: 'new', imageBase64: 'a'.repeat(1000), result: { category: 'B3' } });
    expect(result.history[0].id).toBe('new');
  });
});
