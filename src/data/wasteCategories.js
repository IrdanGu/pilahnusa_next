/**
 * Waste Categories Data
 * Contains category metadata including colors, icons, and descriptions
 */

export const CATEGORIES = {
  organik: {
    key: 'organik',
    label: 'Organik',
    color: 'var(--color-organik-text)',
    bgColor: 'var(--color-organik-bg)',
    textColor: 'var(--color-organik-text)',
    borderColor: 'var(--color-organik-text)',
    iconName: 'Leaf',
    description: 'Sampah yang dapat terurai secara alami oleh mikroorganisme',
    examples: ['Sisa makanan', 'Daun kering', 'Kulit buah', 'Kertas', 'Sayuran']
  },
  anorganik: {
    key: 'anorganik',
    label: 'Anorganik',
    color: 'var(--color-anorganik-text)',
    bgColor: 'var(--color-anorganik-bg)',
    textColor: 'var(--color-anorganik-text)',
    borderColor: 'var(--color-anorganik-text)',
    iconName: 'Recycle',
    description: 'Sampah yang sulit atau tidak dapat terurai, namun dapat didaur ulang',
    examples: ['Plastik', 'Kaca', 'Logam', 'Kaleng', 'Botol']
  },
  B3: {
    key: 'B3',
    label: 'B3 Berbahaya',
    color: 'var(--color-b3-text)',
    bgColor: 'var(--color-b3-bg)',
    textColor: 'var(--color-b3-text)',
    borderColor: 'var(--color-b3-text)',
    iconName: 'AlertTriangle',
    description: 'Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus',
    examples: ['Baterai', 'Cat', 'Pestisida', 'Obat kadaluarsa', 'Lampu neon']
  }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const getCategoryByKey = (key) => {
  return CATEGORIES[key] || CATEGORIES.anorganik;
};
