# Pencarian Bank Sampah Terdekat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan halaman React `/bank-sampah` yang menampilkan bank sampah statis terdekat berdasarkan lokasi browser pengguna dan menyediakan tautan rute Google Maps.

**Architecture:** Dataset bank sampah dan helper geospatial dipisahkan dari `WasteBankPage`. Halaman meminta geolocation melalui browser, mengubah data menjadi daftar berjarak, lalu merender state loading, success, error, atau empty. Route dan item navigasi desktop/mobile menggunakan pola React Router yang sudah ada.

**Tech Stack:** React 18, React Router DOM 6, Lucide React, Vite, Vitest, Testing Library, Playwright, Node.js.

---

## File Map

- Create `src/data/wasteBanks.js`: dataset statis bank sampah dengan schema yang disepakati.
- Create `src/utils/geolocationUtils.js`: Haversine, pengurutan jarak, format jarak, dan pembuatan URL Google Maps.
- Create `src/pages/WasteBankPage.jsx`: lifecycle geolocation, state UI, kartu daftar, retry, dan tautan rute.
- Modify `src/App.jsx`: daftarkan route `/bank-sampah`.
- Modify `src/components/layout/Sidebar.jsx`: tambahkan item navigasi desktop dengan ikon `MapPin`.
- Modify `src/components/layout/BottomNav.jsx`: tambahkan item navigasi mobile dengan ikon `MapPin`.
- Modify `package.json` and `package-lock.json`: skrip/dependensi test unit dan component.
- Create `vitest.config.js`: konfigurasi jsdom dan setup Testing Library.
- Create `src/utils/geolocationUtils.test.js`: unit test geospatial helper.
- Create `src/pages/WasteBankPage.test.jsx`: component test untuk state dan interaksi halaman.
- Modify `tests/e2e/basic.spec.js`: alur E2E route dan izin geolocation.
- Modify `README.md`: dokumentasikan fitur, izin browser, fallback, dan data statis.

### Task 1: Add geospatial test tooling

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.js`
- Create: `src/test/setup.js`

- [ ] **Step 1: Add the test dependencies and scripts**

Run:

```powershell
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Update `package.json` scripts:

```json
"test:unit": "vitest run"
```

Keep the existing `test:e2e` script unchanged.

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
});
```

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Verify the runner before feature code**

Run: `npm run test:unit -- --passWithNoTests`

Expected: Vitest exits successfully with no test failures.

- [ ] **Step 4: Commit**

```powershell
git add package.json package-lock.json vitest.config.js src/test/setup.js
git commit -m "test: configure frontend unit and component tests"
```

### Task 2: Implement dataset and geolocation helpers

**Files:**
- Create: `src/data/wasteBanks.js`
- Create: `src/utils/geolocationUtils.js`
- Test: `src/utils/geolocationUtils.test.js`

- [ ] **Step 1: Write failing helper tests**

Create `src/utils/geolocationUtils.test.js`:

```js
import { describe, expect, it } from 'vitest';
import {
  calculateDistanceKm,
  sortByDistance,
  formatDistance,
  buildGoogleMapsDirectionsUrl,
} from './geolocationUtils';

describe('geolocation utilities', () => {
  it('returns zero for identical coordinates', () => {
    expect(calculateDistanceKm(-6.2, 106.8, -6.2, 106.8)).toBe(0);
  });

  it('calculates a realistic distance in kilometers', () => {
    expect(calculateDistanceKm(0, 0, 0, 1)).toBeCloseTo(111.19, 1);
  });

  it('sorts locations from nearest to farthest without mutating the source', () => {
    const locations = [
      { id: 'far', latitude: 0, longitude: 2 },
      { id: 'near', latitude: 0, longitude: 0.5 },
    ];
    const sorted = sortByDistance(locations, { latitude: 0, longitude: 0 });

    expect(sorted.map((location) => location.id)).toEqual(['near', 'far']);
    expect(locations.map((location) => location.id)).toEqual(['far', 'near']);
    expect(sorted[0].distanceKm).toBeCloseTo(55.6, 1);
  });

  it('formats short and long distances for Indonesian UI', () => {
    expect(formatDistance(0.45)).toBe('450 m');
    expect(formatDistance(1.234)).toBe('1,23 km');
  });

  it('builds a Google Maps directions URL from destination coordinates', () => {
    expect(buildGoogleMapsDirectionsUrl(-6.2, 106.8)).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-6.2%2C106.8'
    );
  });
});
```

- [ ] **Step 2: Run the helper tests and verify failure**

Run: `npm run test:unit -- src/utils/geolocationUtils.test.js`

Expected: FAIL because `geolocationUtils.js` does not exist.

- [ ] **Step 3: Add the static dataset**

Create `src/data/wasteBanks.js` with a named export and at least three entries. Each entry must follow this shape and contain curated coordinates for the app’s target area:

```js
export const WASTE_BANKS = [
  {
    id: 'bank-sampah-melati',
    name: 'Bank Sampah Melati',
    address: 'Jl. Kebon Jeruk No. 10, Jakarta Barat',
    latitude: -6.2,
    longitude: 106.8,
    operatingStatus: 'Buka',
    operatingHours: 'Senin-Sabtu, 08.00-16.00',
    acceptedMaterials: ['Plastik', 'Kertas', 'Logam'],
  },
];
```

Use unique IDs and valid latitude/longitude values for every entry. Keep the dataset frontend-only; do not add an API call.

- [ ] **Step 4: Implement the helpers**

Create `src/utils/geolocationUtils.js`:

```js
const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const latitudeDelta = toRadians(lat2 - lat1);
  const longitudeDelta = toRadians(lon2 - lon1);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const sortByDistance = (locations, userLocation) =>
  locations
    .map((location) => ({
      ...location,
      distanceKm: calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      ),
    }))
    .sort((first, second) => first.distanceKm - second.distanceKm);

export const formatDistance = (distanceKm) =>
  distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(2).replace('.', ',')} km`;

export const buildGoogleMapsDirectionsUrl = (latitude, longitude) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;
```

- [ ] **Step 5: Run the helper tests**

Run: `npm run test:unit -- src/utils/geolocationUtils.test.js`

Expected: all helper tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/data/wasteBanks.js src/utils/geolocationUtils.js src/utils/geolocationUtils.test.js
git commit -m "feat: add waste bank distance utilities and data"
```

### Task 3: Build the Waste Bank page and component tests

**Files:**
- Create: `src/pages/WasteBankPage.jsx`
- Test: `src/pages/WasteBankPage.test.jsx`

- [ ] **Step 1: Write failing component tests**

Create tests using `MemoryRouter`, `userEvent`, and a mocked `navigator.geolocation`:

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WasteBankPage from './WasteBankPage';

const renderPage = () => render(
  <MemoryRouter>
    <WasteBankPage />
  </MemoryRouter>
);

describe('WasteBankPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loading state while requesting location', () => {
    navigator.geolocation = { getCurrentPosition: vi.fn() };
    renderPage();
    expect(screen.getByText('Mencari bank sampah terdekat...')).toBeInTheDocument();
  });

  it('renders locations ordered by distance after geolocation succeeds', async () => {
    navigator.geolocation = {
      getCurrentPosition: vi.fn((success) => success({
        coords: { latitude: -6.2, longitude: 106.8 },
      })),
    };
    renderPage();

    await waitFor(() => expect(screen.getByRole('list', { name: 'Daftar bank sampah' })).toBeInTheDocument());
    expect(screen.getAllByRole('link', { name: /Lihat rute/ }).length).toBeGreaterThan(0);
  });

  it('shows a retry action when location permission fails', async () => {
    const getCurrentPosition = vi.fn((success, error) => error({ code: 1 }));
    navigator.geolocation = { getCurrentPosition };
    renderPage();

    await screen.findByText('Lokasi tidak dapat diakses');
    expect(screen.getByRole('button', { name: 'Coba lagi' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
    expect(getCurrentPosition).toHaveBeenCalledTimes(2);
  });
});
```

The success test must assert the actual first/second names after the dataset is finalized so the order requirement is explicit. Replace the example dataset address above with the curated static records selected for the MVP before implementing the page.

- [ ] **Step 2: Run component tests and verify failure**

Run: `npm run test:unit -- src/pages/WasteBankPage.test.jsx`

Expected: FAIL because `WasteBankPage.jsx` does not exist.

- [ ] **Step 3: Implement the page lifecycle**

Implement `WasteBankPage` with:

```jsx
const requestLocation = () => {
  setStatus('loading');
  setErrorMessage('');
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      setLocations(sortByDistance(WASTE_BANKS, coords));
      setStatus(WASTE_BANKS.length > 0 ? 'success' : 'empty');
    },
    () => {
      setStatus('error');
      setErrorMessage('Lokasi tidak dapat diakses. Izinkan akses lokasi di browser lalu coba lagi.');
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
};
```

Call `requestLocation` from `useEffect` on mount. If `navigator.geolocation` is unavailable, use the same explicit error state with a message explaining that the browser does not support location.

- [ ] **Step 4: Implement the list-first UI**

Render:

```jsx
<main className="waste-bank-page" aria-labelledby="waste-bank-title">
  <header>
    <p className="eyebrow">Fasilitas daur ulang</p>
    <h1 id="waste-bank-title">Bank Sampah Terdekat</h1>
    <p>Temukan lokasi terdekat dari posisi Anda dan pilih bank sampah yang sesuai.</p>
    <Button onClick={requestLocation} icon={<LocateFixed size={18} />}>
      Gunakan lokasi saya
    </Button>
  </header>
</main>
```

For success, render an accessible list whose cards include name, `formatDistance(distanceKm)`, address, operating status, operating hours, accepted material badges, and:

```jsx
<a
  href={buildGoogleMapsDirectionsUrl(location.latitude, location.longitude)}
  target="_blank"
  rel="noreferrer"
  aria-label={`Lihat rute ke ${location.name}`}
>
  Lihat rute
</a>
```

Use existing `Button`, `Card`, `Badge`, `Loader`, and CSS variables instead of introducing a new UI system. For loading, error, and empty states, use explicit Indonesian text and preserve keyboard-accessible controls.

- [ ] **Step 5: Run component tests**

Run: `npm run test:unit -- src/pages/WasteBankPage.test.jsx`

Expected: all page state and retry tests pass.

- [ ] **Step 6: Commit**

```powershell
git add src/pages/WasteBankPage.jsx src/pages/WasteBankPage.test.jsx
git commit -m "feat: add nearby waste bank page"
```

### Task 4: Wire routing and navigation

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/layout/Sidebar.jsx`
- Modify: `src/components/layout/BottomNav.jsx`

- [ ] **Step 1: Add navigation tests to the E2E flow**

Extend `tests/e2e/basic.spec.js` with a separate test:

```js
test('navigates to nearby waste banks', async ({ page }) => {
  await page.goto('/');
  await page.locator('.sidebar__nav-item[aria-label="Bank Sampah"]').click();
  await expect(page).toHaveURL(/\/bank-sampah/);
  await expect(page.getByRole('heading', { name: 'Bank Sampah Terdekat' })).toBeVisible();
});
```

- [ ] **Step 2: Run the new E2E test and verify failure**

Run: `npx playwright test tests/e2e/basic.spec.js -g "nearby waste banks"`

Expected: FAIL because the navigation item and route are not registered.

- [ ] **Step 3: Register the route**

In `src/App.jsx`, import `WasteBankPage` and add:

```jsx
<Route path="/bank-sampah" element={<WasteBankPage />} />
```

- [ ] **Step 4: Add desktop and mobile navigation entries**

In both navigation arrays, add:

```js
{ path: '/bank-sampah', label: 'Bank Sampah', icon: MapPin },
```

Import `MapPin` from `lucide-react`. Keep existing ordering and active-link behavior intact.

- [ ] **Step 5: Run routing and lint checks**

Run:

```powershell
npx playwright test tests/e2e/basic.spec.js -g "nearby waste banks"
npm run lint
```

Expected: the E2E test passes and ESLint exits with zero warnings/errors.

- [ ] **Step 6: Commit**

```powershell
git add src/App.jsx src/components/layout/Sidebar.jsx src/components/layout/BottomNav.jsx tests/e2e/basic.spec.js
git commit -m "feat: wire waste bank navigation"
```

### Task 5: Document and verify the complete feature

**Files:**
- Modify: `README.md`
- Modify: `tests/e2e/basic.spec.js`

- [ ] **Step 1: Add geolocation mocking to the E2E test**

Before navigating to `/bank-sampah`, grant geolocation permission and set a deterministic context location:

```js
await page.context().grantPermissions(['geolocation']);
await page.context().setGeolocation({ latitude: -6.2, longitude: 106.8 });
await page.goto('/bank-sampah');
await expect(page.getByRole('list', { name: 'Daftar bank sampah' })).toBeVisible();
await expect(page.getByRole('link', { name: /Lihat rute/ }).first()).toHaveAttribute(
  'href',
  /google\.com\/maps\/dir/
);
```

Add a separate permission-denied test by creating a context without geolocation permission and asserting `Lokasi tidak dapat diakses` and `Coba lagi`.

- [ ] **Step 2: Update README**

Add “Pencarian bank sampah terdekat” under the feature list and document:

- Open `/bank-sampah` from the sidebar or mobile navigation.
- Browser location permission is required to sort by distance.
- If permission is denied, the page provides a retry action and does not show fake distances.
- The MVP uses static frontend data in `src/data/wasteBanks.js`.
- “Lihat rute” opens Google Maps in a new tab.

- [ ] **Step 3: Run the complete targeted validation**

Run:

```powershell
npm run test:unit
npm run lint
npx playwright test tests/e2e/basic.spec.js
npm run build
```

Expected: unit/component tests pass, lint reports no errors or warnings, all E2E tests pass, and Vite produces a successful production build.

- [ ] **Step 4: Review the diff**

Run:

```powershell
git --no-pager diff --check HEAD~5..HEAD
git status --short
```

Confirm only the planned feature files changed and there are no generated artifacts or secrets.

- [ ] **Step 5: Commit documentation and final E2E updates**

```powershell
git add README.md tests/e2e/basic.spec.js
git commit -m "docs: document nearby waste bank search"
```
