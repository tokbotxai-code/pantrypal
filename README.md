# PantryPal

A simple home pantry tracker by NovoPix. Keep what you have, see which dates are coming up, and build a shopping list. No account needed: everything is saved in the browser on your device.

## Features
- Pantry items with quantity, unit, category, storage location (fridge, freezer, pantry, cupboard) and an optional use-by / best-before date
- "Use first" box for items whose recorded date is 3 days away or less, filters (category, location, date label, date status) and search
- Shopping list, with one click to add a pantry item, or all items with quantity 0
- Back up to a JSON file and restore it (data lives only in this browser)
- Installable PWA, works offline after the first visit
- Privacy page; no analytics, no advertising

PantryPal shows dates **you entered**. It never says whether food is safe to eat.

## Run locally
```
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
```
Node 20 or newer.

## Deploy
Static site (hash routing, so no rewrite rule is needed). Hosting options: **GitHub Pages** (workflow in `.github/workflows/pages.yml`; in the repo go to Settings, Pages, Source: GitHub Actions) or Render (static site, build `npm ci && npm run build`, publish directory `dist` in lowercase, or the Blueprint `render.yaml`).

## Project layout
- `src/data/pantry.ts` storage, validation, dates, backup and restore (single source of truth for data)
- `src/pages/` Dashboard (pantry), Shopping, Privacy, not-found
- `src/components/` PantryForm, Brand, error boundary, toast and tooltip primitives
- `src/index.css` all styling (Tailwind v4 plus custom CSS)
- `public/` manifest, service worker (`sw.js`), icons

## Not built yet
Accounts, household sharing and sync across devices (would need a backend), push reminders, payments. See `CLAUDE.md` for the rules before adding any of them.
