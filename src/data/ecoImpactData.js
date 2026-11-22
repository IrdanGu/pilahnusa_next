/**
 * Eco-Impact gamification data for BilahBeu AI.
 *
 * Every number here is a documented AVERAGE ESTIMATE used to make sorting feel
 * rewarding — not a per-item life-cycle measurement. Estimates are derived from
 * common waste-management references (IPCC, SIPSN/KLHK public material) and are
 * intentionally conservative so the app never over-promises savings.
 */

/**
 * Estimated CO2e saved (kg) per item that is sorted correctly instead of ending
 * up in a landfill / open dumping site. Keys match the canonical ledger labels.
 * @type {Readonly<{Organik: number, Anorganik: number, B3: number}>}
 */
export const CATEGORY_CO2_SAVED_KG = Object.freeze({
  Organik: 0.35,
  Anorganik: 0.65,
  B3: 0.9,
});

/**
 * Gamification points awarded per correctly sorted item.
 * B3 is worth the most because it requires the most care.
 * @type {Readonly<{Organik: number, Anorganik: number, B3: number}>}
 */
export const CATEGORY_POINTS = Object.freeze({
  Organik: 10,
  Anorganik: 15,
  B3: 25,
});

/**
 * Combined per-category impact profile (read-only convenience view of the two
 * tables above).
 */
export const CATEGORY_IMPACT = Object.freeze({
  Organik: Object.freeze({ co2SavedKg: CATEGORY_CO2_SAVED_KG.Organik, points: CATEGORY_POINTS.Organik }),
  Anorganik: Object.freeze({ co2SavedKg: CATEGORY_CO2_SAVED_KG.Anorganik, points: CATEGORY_POINTS.Anorganik }),
  B3: Object.freeze({ co2SavedKg: CATEGORY_CO2_SAVED_KG.B3, points: CATEGORY_POINTS.B3 }),
});

/**
 * Six Indonesian level milestones, ordered from lowest to highest points.
 * @type {ReadonlyArray<{id: string, name: string, minPoints: number, description: string, icon: string}>}
 */
export const ECO_LEVELS = Object.freeze([
  Object.freeze({
    id: 'kecambah',
    name: 'Kecambah',
    minPoints: 0,
    description: 'Baru mulai menumbuhkan kebiasaan memilah sampah.',
    icon: 'Sprout',
  }),
  Object.freeze({
    id: 'tunas-hijau',
    name: 'Tunas Hijau',
    minPoints: 100,
    description: 'Kebiasaan memilah mulai berakar dan tumbuh.',
    icon: 'Leaf',
  }),
  Object.freeze({
    id: 'penggerak-pilah',
    name: 'Penggerak Pilah',
    minPoints: 250,
    description: 'Anda rutin memilah dan menggerakkan orang sekitar.',
    icon: 'Recycle',
  }),
  Object.freeze({
    id: 'duta-daur-ulang',
    name: 'Duta Daur Ulang',
    minPoints: 500,
    description: 'Duta daur ulang yang konsisten menyetor ke bank sampah.',
    icon: 'Award',
  }),
  Object.freeze({
    id: 'pahlawan-bumi',
    name: 'Pahlawan Bumi',
    minPoints: 1000,
    description: 'Dampak positif Anda sudah terasa bagi Bumi.',
    icon: 'Earth',
  }),
  Object.freeze({
    id: 'penjaga-nusantara',
    name: 'Penjaga Nusantara',
    minPoints: 2000,
    description: 'Level tertinggi: penjaga lingkungan Nusantara sejati.',
    icon: 'ShieldCheck',
  }),
]);

/**
 * Eight unlockable badges. Every condition receives `{ ledger, streak }` where
 * `ledger` is the lifetime impact ledger and `streak` is the current scan
 * streak in days. Conditions are pure and must stay side-effect free.
 * @type {ReadonlyArray<{id: string, name: string, description: string, icon: string, condition: function}>}
 */
export const ECO_BADGES = Object.freeze([
  Object.freeze({
    id: 'first-scan',
    name: 'Langkah Pertama',
    description: 'Menyelesaikan scan sampah pertama di BilahBeu AI.',
    icon: 'Sparkles',
    condition: ({ ledger }) => (ledger?.totalScans || 0) >= 1,
  }),
  Object.freeze({
    id: 'five-scans',
    name: 'Lima Kali Pilah',
    description: 'Melakukan 5 scan sampah.',
    icon: 'ScanLine',
    condition: ({ ledger }) => (ledger?.totalScans || 0) >= 5,
  }),
  Object.freeze({
    id: 'ten-scans',
    name: 'Sepuluh Kali Pilah',
    description: 'Melakukan 10 scan sampah.',
    icon: 'Camera',
    condition: ({ ledger }) => (ledger?.totalScans || 0) >= 10,
  }),
  Object.freeze({
    id: 'b3-guardian',
    name: 'Penjaga B3',
    description: 'Mengarahkan limbah B3 ke jalur pembuangan yang aman.',
    icon: 'ShieldAlert',
    condition: ({ ledger }) => (ledger?.categoryCounts?.B3 || 0) >= 1,
  }),
  Object.freeze({
    id: 'streak-3',
    name: 'Streak 3 Hari',
    description: 'Scan sampah 3 hari berturut-turut.',
    icon: 'Flame',
    condition: ({ streak }) => (streak || 0) >= 3,
  }),
  Object.freeze({
    id: 'streak-7',
    name: 'Streak 7 Hari',
    description: 'Scan sampah 7 hari berturut-turut.',
    icon: 'Zap',
    condition: ({ streak }) => (streak || 0) >= 7,
  }),
  Object.freeze({
    id: 'quiz-ace',
    name: 'Master Kuis',
    description: 'Menjawab semua pertanyaan kuis dengan benar.',
    icon: 'Trophy',
    condition: ({ ledger }) => (ledger?.quizPerfectCount || 0) >= 1,
  }),
  Object.freeze({
    id: 'bank-supporter',
    name: 'Pendukung Bank Sampah',
    description: 'Menandai bank sampah favorit Anda.',
    icon: 'MapPin',
    condition: ({ ledger }) => (ledger?.favoritesCount || 0) >= 1,
  }),
]);

/** Total number of badges available (used for progress display). */
export const TOTAL_BADGES = ECO_BADGES.length;

/**
 * Look up a level definition by its id.
 * @param {string} id
 * @returns {Object|null} Level definition or null when not found.
 */
export const getLevelById = (id) => ECO_LEVELS.find((level) => level.id === id) || null;
