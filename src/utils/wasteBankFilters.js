export const extractKecamatan = (address = '') => {
  if (!address || typeof address !== 'string') return '';
  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[1] : parts[0] || '';
};

export const getUniqueKecamatan = (banks = []) =>
  [...new Set((banks || []).map((bank) => extractKecamatan(bank?.address)).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));

export const getUniqueStatuses = (banks = []) =>
  [...new Set((banks || []).map((bank) => bank?.operatingStatus).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));

export const filterAndSortBanks = (banks = [], options = {}) => {
  const { query = '', kecamatan = '', status = '', favoritesOnly = false, favoriteIds = [], sortBy = 'name' } = options;
  const favorites = new Set(favoriteIds || []);
  const needle = String(query || '').toLowerCase();
  const filtered = (banks || []).filter((bank) => {
    const text = `${bank?.name || ''} ${bank?.address || ''}`.toLowerCase();
    if (needle && !text.includes(needle)) return false;
    if (kecamatan && extractKecamatan(bank?.address) !== kecamatan) return false;
    if (status && bank?.operatingStatus !== status) return false;
    if (favoritesOnly && !favorites.has(bank?.id)) return false;
    return true;
  });
  return filtered.sort((a, b) => {
    const favoriteDiff = Number(favorites.has(b?.id)) - Number(favorites.has(a?.id));
    if (favoriteDiff) return favoriteDiff;
    if (sortBy === 'capacity') {
      const ac = Number.isFinite(Number(a?.capacityTonsPerDay)) ? Number(a.capacityTonsPerDay) : -Infinity;
      const bc = Number.isFinite(Number(b?.capacityTonsPerDay)) ? Number(b.capacityTonsPerDay) : -Infinity;
      return bc - ac;
    }
    if (sortBy === 'distance') return (Number(a?.distanceKm) || Infinity) - (Number(b?.distanceKm) || Infinity);
    return String(a?.name || '').localeCompare(String(b?.name || ''), 'id');
  });
};
