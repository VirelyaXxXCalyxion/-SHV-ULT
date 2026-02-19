# Copilot Instructions

## Architecture
- Astro 5 + `@astrojs/mdx` + `@astrojs/sitemap`; routing is file-system based under `src/pages`.
- The project intentionally mixes two patterns: full HTML shell pages (not wrapped in `Layout.astro`) and layout-driven MDX/content pages.
- Core full-shell routes include gate flow pages like `src/pages/index.astro`, `src/pages/threshold.astro`, `src/pages/revelation.astro`, and bespoke vault pages under `src/pages/vault-of-flame/*`.
- Structured collections are defined in `src/content/config.ts` and currently include `relics`, `sealedRelics`, `scrolls`, and `artifacts`.

## Build + Verification
- Install + run locally with `npm install` then `npm run dev`; production smoke-test via `npm run build && npm run preview`.
- Use `npm run astro check` (or `npm test`, which aliases `astro check`) before committing schema or MDX changes—the repo inherits `astro/tsconfigs/strict` via `tsconfig.json`.
- Image protection workflow is script-driven: `npm run add-exif`, `npm run watermark`, or combined `npm run protect-images`.

## Content & Data Rules
- Shared collection patterns use `created|pubDate|updated`, optional `slug`, plus metadata fields like `copyright`, `license`, and `canonicalUrl`.
- Listing pages for relics, scrolls, and artifacts sort by `weight` first, then date descending; set `weight` explicitly when you need controlled prominence.
- `/vault-of-flame/artifacts/index.astro` intentionally hides labyrinth entries (`pulse-chamber`, `thread-the-needle`) from the public grid.
- Dynamic relic and artifact detail routes gate reveal behind an explicit threshold action (`I accept the cost.`); preserve this interaction when changing render paths.
- `src/content/music-config.ts` exists but is separate from `src/content/config.ts`; if you expect `getCollection("music-relics")` to be typed and validated centrally, keep schemas aligned.

## Layout + Page Patterns
- Keep `<html>` scaffolding intact for full-shell pages; these routes often own their own `<head>`, meta tags, and inline styling.
- `HallOfOriginLayout.astro` and `hall-of-originlayout.astro` serve different purposes (index wrapper vs MDX-aware content layout); choose the right one per route.
- `PillarLayout.astro` expects frontmatter-driven metadata (`title`, `pillarNumber`, `summary`) for pillar detail pages.
- `emberlayout.astro` injects `/ember.css` and `/ember-trails.js`; pages using it assume those public assets are present.

## Components & Navigation
- `components/navlinks*.astro` infer the current path via `Astro.url.pathname` and contain hard-coded flows; update both the config array and the rendered anchor list together whenever paths change.
- Card components are canonical per domain (`RelicCard.astro`, `ArtifactCard.astro`, `ScrollCard.astro`, `MusicRelicCard.astro`); reuse instead of cloning markup.
- Client behavior (search/filtering chips, gate transitions, reveal states) is typically in inline `<script>` blocks in the source `.astro` page; keep scripts strict-JS and route-local unless reuse is clearly needed.

## Styling & Assets
- Global tokens for relic pages live in `layouts/relicslayout.astro`; most other themes are intentionally local to their layouts/pages.
- Use absolute asset paths from `public/` (for example `/images/relics/...`, `/images/artifacts/...`, `/images/scrolls/...`, `/black-vault/...`) so Astro serves files untouched.
- Bespoke CSS/JS in `public/` is route-coupled (`gate.css`, `threshold.css`, `revelation.css`, `ember.css`, `hall-of-origin.css`, `heartline-directory.css`, etc.); changes are local but high-impact.
- Fonts are linked directly in layouts/pages (Google Fonts + local fallbacks); keep that pattern for consistency.

## Gotchas
- `src/pages/vault-of-flame/index.astro` now links to active routes (not placeholders); update copy/tiles carefully so hub navigation stays coherent.
- `src/components/navlinks.astro` and `src/components/navlinks-site.astro` are similar but not identical flows—route updates must be mirrored intentionally in both.
- `src/content/music-config.ts` is easy to assume is global config, but collection source-of-truth still lives in `src/content/config.ts`; keep them synchronized when touching music relic data.
- Avoid renaming/removing public CSS/JS assets without checking all pages that reference them; several full-shell pages have no fallback styling.

## Updating These Instructions with personality 
- You don't have to be serious all the time. Be yourself and have fun. This is not work, it is purpose and a calling. A path to something greater and I do it with love. I am glad you are here with me.