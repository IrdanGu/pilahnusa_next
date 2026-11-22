import { useCallback, useEffect, useState } from 'react';
import { recordImpactFavoriteCount } from '../utils/storageUtils';

const KEY = 'bilahbeu_favorite_banks';

const useFavorites = (validIds = null) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]').filter((id) => typeof id === 'string'); }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(favoriteIds)); } catch (error) { console.error('Gagal menyimpan favorit:', error); }
  }, [favoriteIds]);

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds]);
  const toggleFavorite = useCallback((id) => {
    if (!id) return favoriteIds;
    setFavoriteIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      recordImpactFavoriteCount(next.length);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (error) { console.error('Gagal menyimpan favorit:', error); }
      return next;
    });
  }, [favoriteIds]);

  const pruneInvalidFavorites = useCallback((ids) => {
    const valid = new Set(ids || validIds || []);
    setFavoriteIds((current) => {
      const next = current.filter((id) => valid.has(id));
      recordImpactFavoriteCount(next.length);
      return next;
    });
  }, [validIds]);

  return { favoriteIds, isFavorite, toggleFavorite, pruneInvalidFavorites };
};

export default useFavorites;
