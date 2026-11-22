import { describe, expect, it } from 'vitest';
import { extractKecamatan, filterAndSortBanks, getUniqueKecamatan, getUniqueStatuses } from './wasteBankFilters';

describe('waste bank filters', () => {
  it('extracts kecamatan', () => {
    expect(extractKecamatan('Cigadung, Kuningan')).toBe('Kuningan');
  });

  it('returns unique values', () => {
    const banks = [{ address: 'A, Cilimus', operatingStatus: 'Buka' }, { address: 'B, Cilimus', operatingStatus: 'Tutup' }];
    expect(getUniqueKecamatan(banks)).toEqual(['Cilimus']);
    expect(getUniqueStatuses(banks)).toEqual(['Buka', 'Tutup']);
  });

  it('filters and pins favorites', () => {
    const banks = [{ id:'a', name:'Alpha', address:'A, Cilimus', operatingStatus:'Buka', capacityTonsPerDay:1 }, { id:'b', name:'Beta', address:'B, Kuningan', operatingStatus:'Tutup', capacityTonsPerDay:2 }];
    expect(filterAndSortBanks(banks, { kecamatan:'Cilimus', favoritesOnly:true, favoriteIds:['a'], sortBy:'capacity' }).map((bank) => bank.id)).toEqual(['a']);
  });
});
