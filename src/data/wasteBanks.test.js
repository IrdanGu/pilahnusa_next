import { describe, expect, it } from 'vitest';
import { WASTE_BANKS } from './wasteBanks';

const expectedRows = [
  ['bank-sampah-cilimus-caracas', 'Cilimus', 'Caracas', -6.8597001, 108.4927172, 'Tutup', 0.009],
  ['bank-sampah-kuningan-cigadung', 'Kuningan', 'Cigadung', -6.9829944, 108.4631788, 'Status tidak tersedia', 0.029],
  ['bank-sampah-kadugede-kadugede', 'Kadugede', 'Kadugede', -7.0048522, 108.4480426, 'Buka', 0.029],
  ['bank-sampah-luragung-luragung', 'Luragung', 'Luragung', -7.0142466, 108.6179757, 'Buka', 0.007],
  ['bank-sampah-cibingbin-sukamaju', 'Cibingbin', 'Sukamaju', -7.0526768, 108.7426537, 'Buka'],
  ['bank-sampah-kuningan-sudirman', 'Kuningan', 'Sudirman', -6.9855324, 108.4857728, 'Tutup'],
  ['bank-sampah-nusaherang-haurkuning', 'Nusaherang', 'Haurkuning', -7.0276315, 108.3927864, 'Tutup', 0.146857142857143],
  ['bank-sampah-sindangagung-kertayasa', 'Sindangagung', 'Kertayasa', -7.0274108, 108.3309832, 'Buka', 0.036],
  ['bank-sampah-nusaherang-windusari', 'Nusaherang', 'Windusari', -7.0197104, 108.4400771, 'Buka', 0.09],
  ['bank-sampah-japara-dukuh-dalem', 'Japara', 'Dukuh Dalem', -6.9221975, 108.4774693, 'Buka', 0.214],
  ['bank-sampah-ciniru-cisalak-cipedes', 'Ciniru', 'Cisalak Cipedes', -7.0645545, 108.5106452, 'Buka', 0.009],
  ['bank-sampah-cigugur-winduherang', 'Cigugur', 'Winduherang', -6.9658183, 108.4569795, 'Buka', 0.045],
  ['bank-sampah-ciawigebang-ciomas', 'Ciawigebang', 'Ciomas', -6.9752118, 108.5580161, 'Buka', 0.003],
  ['bank-sampah-kuningan-kuningan-1', 'Kuningan', 'Kuningan', -6.9840517, 108.4802512, 'Buka', 0.025],
  ['bank-sampah-sindangagung-kertaungaran', 'Sindangagung', 'Kertaungaran', -6.9793829, 108.5265641, 'Buka', 0.031],
  ['bank-sampah-darma-tugumulya', 'Darma', 'Tugumulya', -7.0646276, 108.3952698, 'Buka', 0.114],
  ['bank-sampah-kuningan-kuningan-2', 'Kuningan', 'Kuningan', -6.9173571, 108.4919328, 'Buka', 0.143],
  ['bank-sampah-ciniru-gunungmanik', 'Ciniru', 'Gunungmanik', -7.0877412, 108.4975964, 'Buka'],
];

describe('WASTE_BANKS dataset contract', () => {
  it('matches every workbook row exactly', () => {
    expect(WASTE_BANKS).toHaveLength(18);
    expectedRows.forEach(([id, facility, address, latitude, longitude, status, capacity], index) => {
      const bank = WASTE_BANKS[index];
      expect(bank).toMatchObject({
        id,
        name: `Bank Sampah ${facility}`,
        address: `${address}, ${facility}`,
        latitude,
        longitude,
        operatingStatus: status,
        operatingHours: 'Jam operasional tidak tersedia',
        acceptedMaterials: ['Material yang diterima belum dicantumkan'],
        facilityType: 'Bank Sampah',
      });
      if (capacity === undefined) {
        expect(bank).not.toHaveProperty('capacityTonsPerDay');
      } else {
        expect(bank.capacityTonsPerDay).toBe(capacity);
      }
    });
  });

  it('has unique stable identifiers and valid coordinates', () => {
    const ids = WASTE_BANKS.map((bank) => bank.id);
    expect(new Set(ids).size).toBe(18);
    WASTE_BANKS.forEach((bank) => {
      expect(Number.isFinite(bank.latitude)).toBe(true);
      expect(Number.isFinite(bank.longitude)).toBe(true);
      expect(bank.latitude).toBeGreaterThanOrEqual(-90);
      expect(bank.latitude).toBeLessThanOrEqual(90);
      expect(bank.longitude).toBeGreaterThanOrEqual(-180);
      expect(bank.longitude).toBeLessThanOrEqual(180);
    });
  });

  it('freezes the dataset records and nested materials arrays', () => {
    expect(Object.isFrozen(WASTE_BANKS)).toBe(true);
    WASTE_BANKS.forEach((bank) => {
      expect(Object.isFrozen(bank)).toBe(true);
      expect(Object.isFrozen(bank.acceptedMaterials)).toBe(true);
    });
  });

  it('preserves source status counts including the unavailable blank status', () => {
    expect(WASTE_BANKS.filter((bank) => bank.operatingStatus === 'Buka')).toHaveLength(14);
    expect(WASTE_BANKS.filter((bank) => bank.operatingStatus === 'Tutup')).toHaveLength(3);
    expect(WASTE_BANKS.filter((bank) => bank.operatingStatus === 'Status tidak tersedia')).toHaveLength(1);
  });
});
