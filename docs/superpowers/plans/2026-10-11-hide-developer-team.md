# Menonaktifkan Akses Tim Pengembang Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every public navigation and route entry for the developer-team page, delete its unused identity assets, and redact developer and group names from the README.

**Architecture:** Keep the existing application navigation intact except for the developer-team entry. Remove the team page at the routing boundary so direct `/team` access no longer resolves, and remove the page-specific component/assets because they have no remaining consumers. Keep the README focused on product and technical documentation with neutral wording.

**Tech Stack:** React 18, React Router DOM 6, Vite, ESLint, Vitest, Playwright, Markdown.

---

### Task 1: Remove developer-team navigation and route access

**Files:**
- Modify: `src/components/layout/Sidebar.jsx` — remove the `Users` icon import and the `/team` navigation item.
- Modify: `src/components/layout/Layout.jsx` — remove the `Link` and `Users` imports and the mobile floating team button block/styles; preserve `Sidebar`, `BottomNav`, and all other layout behavior.
- Modify: `src/App.jsx` — remove the `TeamPage` import and `/team` route.
- Delete: `src/pages/TeamPage.jsx` — remove the now-unreachable page.

- [ ] **Step 1: Confirm the current references before editing**

Run:

```powershell
rg -n -i "TeamPage|/team|Tim Pengembang|mobile-team-btn|Users" src
```

Expected: matches are limited to the Sidebar item, Layout floating button/imports/styles, App route/import, and the TeamPage implementation.

- [ ] **Step 2: Remove the desktop navigation item**

In `src/components/layout/Sidebar.jsx`, remove `Users` from the `lucide-react` import and delete this item from `NAV_ITEMS`:

```jsx
{ path: '/team', label: 'Tim Pengembang', icon: Users },
```

Leave the other navigation entries unchanged.

- [ ] **Step 3: Remove the mobile floating entry point**

In `src/components/layout/Layout.jsx`, remove the `Link`, `useLocation`, and `Users` imports because they are used only by the team button. Delete the `isHomePage` state and the complete `{isHomePage && (...)}` block that links to `/team`. Delete the `.mobile-team-btn` and `.mobile-team-btn:active` rules plus the desktop media-query rule that hides it. Keep the main content, mobile bottom padding, sidebar, and `BottomNav` unchanged.

- [ ] **Step 4: Remove the route**

In `src/App.jsx`, delete:

```jsx
import TeamPage from './pages/TeamPage';
```

and delete:

```jsx
<Route path="/team" element={<TeamPage />} />
```

- [ ] **Step 5: Delete the unreachable page**

Delete `src/pages/TeamPage.jsx`. Do not remove the generic journey terminology from unrelated documentation or components.

- [ ] **Step 6: Verify the navigation/routing edit**

Run:

```powershell
rg -n -i "TeamPage|/team|Tim Pengembang|mobile-team-btn" src
```

Expected: no matches.

- [ ] **Step 7: Commit the navigation change**

Run:

```powershell
git add src/App.jsx src/components/layout/Layout.jsx src/components/layout/Sidebar.jsx
git rm src/pages/TeamPage.jsx
git commit -m "feat: remove developer team navigation" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected: one commit removing the public route and navigation entry without touching the remaining navigation items.

### Task 2: Remove page-specific team assets

**Files:**
- Delete: `public/images/teams/ema.jpeg`
- Delete: `public/images/teams/galih.jpg`
- Delete: `public/images/teams/gisca.png`
- Delete: `public/images/teams/irdan.jpg`
- Delete: `public/images/teams/naya.jpg`
- Delete: `public/images/teams/ryan.jpg`
- Delete: `dist/images/teams/ema.jpeg`
- Delete: `dist/images/teams/galih.jpg`
- Delete: `dist/images/teams/gisca.png`
- Delete: `dist/images/teams/irdan.jpg`
- Delete: `dist/images/teams/naya.jpg`
- Delete: `dist/images/teams/ryan.jpg`

- [ ] **Step 1: Confirm no remaining source consumer references the assets**

Run:

```powershell
rg -n -i "images/teams|ema\.jpeg|galih\.jpg|gisca\.png|irdan\.jpg|naya\.jpg|ryan\.jpg" src public
```

Expected: no matches after Task 1 removes `TeamPage.jsx`.

- [ ] **Step 2: Delete only the six team profile images from source and generated output**

Run:

```powershell
git rm public/images/teams/ema.jpeg public/images/teams/galih.jpg public/images/teams/gisca.png public/images/teams/irdan.jpg public/images/teams/naya.jpg public/images/teams/ryan.jpg dist/images/teams/ema.jpeg dist/images/teams/galih.jpg dist/images/teams/gisca.png dist/images/teams/irdan.jpg dist/images/teams/naya.jpg dist/images/teams/ryan.jpg
```

Do not delete the `teams` directories if they become empty through normal Git tracking; no unrelated public or generated assets should be changed.

- [ ] **Step 3: Commit the asset cleanup**

Run:

```powershell
git commit -m "chore: remove unused developer team assets" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 3: Redact developer and group names from README

**Files:**
- Modify: `README.md` — remove the complete developer-team table and neutralize the group-name mention.

- [ ] **Step 1: Remove the developer-team section**

Delete the `## Tim Pengembang` heading and its complete table, from the heading through the last member row. Keep the surrounding `Tech Stack` and dashboard sections in their existing order.

- [ ] **Step 2: Neutralize the dashboard description**

Replace:

```markdown
Analisis dataset oleh tim Data Scientist tersedia melalui Streamlit:
```

with:

```markdown
Analisis dataset tersedia melalui Streamlit:
```

Keep the dashboard link unchanged.

- [ ] **Step 3: Verify README redaction**

Run:

```powershell
rg -n -i "Tim Pengembang|Data Scientist|Galih|Ema|Irdan|Nayarah|Ryan|Gisca|Universitas Kuningan|Universitas Primakara|Universitas Sulawesi Barat|Universitas Negeri Surabaya|CACC|CFCC|CDCC" README.md
```

Expected: no matches.

- [ ] **Step 4: Commit the README update**

Run:

```powershell
git add README.md
git commit -m "docs: remove developer team identities from readme" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### Task 4: Run focused validation

**Files:**
- Test: existing unit, lint, build, and end-to-end suites; no new test file is needed because the change removes an existing route and navigation entry.

- [ ] **Step 1: Check the final source and README references**

Run:

```powershell
rg -n -i "TeamPage|/team|Tim Pengembang|mobile-team-btn|images/teams|Data Scientist|Galih|Ema|Irdan|Nayarah|Ryan|Gisca|CACC|CFCC|CDCC" src public README.md
```

Expected: no matches.

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: exit code 0 with no warnings treated as errors.

- [ ] **Step 3: Run the unit suite**

Run:

```powershell
npm run test:unit
```

Expected: all existing unit tests pass.

- [ ] **Step 4: Build the frontend**

Run:

```powershell
npm run build
```

Expected: Vite completes successfully without unresolved imports.

- [ ] **Step 5: Run the end-to-end suite**

Run:

```powershell
npm run test:e2e
```

Expected: all existing Playwright scenarios pass.

- [ ] **Step 6: Review the final diff**

Run:

```powershell
git --no-pager diff origin/main..HEAD --stat
git status --short
```

Expected: only the approved navigation, team-page/assets, README, and committed design/plan files are changed; the working tree is clean.
