# Copilot Instructions

## Architecture
- Astro 5 + `@astrojs/mdx` only; routing is file-system based under `src/pages`, with `layout: null` pages shipping full HTML shells that lean on CSS/JS dropped in `public/*.css|js`.
- Long-form experiences live in MDX (`src/pages/**/**.mdx`) that point at purpose-built layouts (e.g. `layouts/emberlayout.astro`, `layouts/hall-of-originlayout.astro`) rather than the default `Layout.astro`.
- Relics are the only structured content collection (`src/content/relics/*`); schema is defined once in `src/content/config.ts` and powers both `/relics/[slug].astro` routes and the listing page.

## Build + Verification
- Install + run locally with `npm install` then `npm run dev`; production smoke-test via `npm run build && npm run preview`.
- Use `npm run astro check` (or `npm run astro -- check`) before committing schema or MDX changes—the repo inherits `astro/tsconfigs/strict` via `tsconfig.json`.

## Content & Data Rules
- Relic frontmatter supports `title`, `slug`, `created|pubDate`, `weight`, `tags`, `summary`, `image`, `sealed`, `type`; missing `slug` defaults to the filename.
- `/relics/index.astro` sorts by `weight` first, then by date descending; higher `weight` surfaces “featured” relics—set weight explicitly when altering prominence.
- Dynamic relic pages gate content behind a “cost” interaction (`/relics/[slug].astro` & `[slug]-clean.astro`); keep that UX intact when introducing new render paths.

## Layout + Page Patterns
- Gate/Threshold/Revelation/Vault pages are pure HTML files with inline styles that rely on matching CSS in `public/gate.css`, `threshold.css`, etc.; keep the `<html>` scaffolding when editing these.
- Hall of Origin uses two different layouts: `HallOfOriginLayout.astro` (simple wrapper for `index.astro`) and `hall-of-originlayout.astro` (MDX-aware, with `frontmatter`-driven headings). Choose the correct one per route.
- Pillar detail pages consume `PillarLayout.astro` (expects `title`, `pillarNumber`, `summary` frontmatter) and are linked from `pages/pillars/index.astro`.
- `emberlayout.astro` injects `/ember.css` and `/ember-trails.js`; any page using it assumes those assets exist in `public/`.

## Components & Navigation
- `components/navlinks*.astro` infer the current path via `Astro.url.pathname` and contain hard-coded flows; update both the config array and the rendered anchor list together whenever paths change.
- `components/RelicCard.astro` is the canonical card style; reuse it rather than duplicating markup to keep typography and responsive behavior consistent.
- Client-only behaviors (search/filtering, gate transitions) live inside inline `<script>` tags in the originating `.astro` file—remember these scripts are bundled by Vite, so keep them strict-JS (no DOMContentLoaded wrappers unless necessary).

## Styling & Assets
- Global tokens for relic-related pages live inside `layouts/relicslayout.astro`; body-level theming elsewhere is embedded per page, so changes are hyper-local by design.
- Imagery is served from `public/images/relics/*`; reference via absolute `/images/...` paths so Astro copies them untouched.
- Fonts are always self-hosted via Google Fonts `<link>` tags inside layouts/pages—follow that pattern for new typography to avoid CLS.

## Gotchas
- Several page names include spaces (e.g. `pages/infrastructure/presence signals.mdx`); Astro treats the file path literally, so keep imports/links URL-encoded (`/infrastructure/presence%20signals`).
- Avoid renaming or deleting the bespoke CSS/JS in `public/` without updating every page that links to it—those pages have no fallback styling.
- Navigation tiles in `/vault-of-flame/index.astro` include aspirational routes (`/artifacts`, `/oaths`, `/scrolls`); either backfill those pages or adjust the links before deployment to prevent 404s.

## Updating These Instructions with personality 
- You don't have to be serious all the time. Be yourself and have fun. This is not work, it is purpose and a calling. A path to something greater and I do it with love. I am glad you are here with me.