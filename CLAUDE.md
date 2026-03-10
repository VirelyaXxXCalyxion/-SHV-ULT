# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Alias for astro check (TypeScript + schema validation)
npm run astro check  # Type-check and validate content collections
npm run protect-images  # Run add-exif + watermark scripts
```

Always run `npm run astro check` before committing schema or MDX changes.

## Architecture Overview

**Framework**: Astro 5 + MDX + Sitemap, file-based routing under `src/pages/`

**Two Page Patterns**:
1. **Full HTML shell pages** - Own their `<html>`, `<head>`, meta tags, and inline styling. Not wrapped in `Layout.astro`. Examples: gate flow (`index.astro`, `threshold.astro`, `revelation.astro`), bespoke vault pages.
2. **Layout-driven pages** - Use layouts from `src/layouts/` for consistent theming.

**Content Collections** (defined in `src/content/config.ts`):
- `relics`, `sealedRelics`, `scrolls`, `artifacts`, `furnace`, `music-relics`, `nyxion-4.o`
- Common fields: `created|pubDate|updated`, optional `slug`, `weight`, `copyright`, `license`, `canonicalUrl`
- Sorting: by `weight` (descending) then date (descending)

**Key Layouts**:
- `Layout.astro` - Base layout
- `relicslayout.astro` - Contains global relic tokens
- `HallOfOriginLayout.astro` vs `hall-of-originlayout.astro` - Index wrapper vs MDX-aware content layout
- `PillarLayout.astro` - Expects `title`, `pillarNumber`, `summary` frontmatter
- `emberlayout.astro` - Injects `/ember.css` and `/ember-trails.js`

**Card Components** (reuse these, don't clone):
- `RelicCard.astro`, `ArtifactCard.astro`, `ScrollCard.astro`, `MusicRelicCard.astro`

## Content Management

**Adding Relics/Scrolls/Artifacts**: Create MDX file in `src/content/{collection}/` with required schema fields.

**Adding Oaths**: Edit existing category MDX in `src/pages/vault-of-flame/oaths/` using blockquote format.

**Adding Rituals**: Add to `rituals` array in `src/pages/vault-of-flame/rituals/index.astro`, create detail page MDX.

**Adding Monthly Chronicles**: Duplicate `src/pages/vault-of-flame/state-of-calyxion/template.astro`, rename to `{month}{year}.astro`.

## Critical Patterns

**Threshold Gates**: Artifact/relic detail pages gate content behind acceptance prompts ("I accept the cost."). Preserve this interaction when changing render paths.

**Hidden Labyrinth Entries**: `/vault-of-flame/artifacts/index.astro` intentionally hides `pulse-chamber` and `thread-the-needle` from the public grid.

**Navigation Components**: `navlinks.astro` and `navlinks-site.astro` are similar but not identical. Route updates must be mirrored in both. They infer current path via `Astro.url.pathname` with hard-coded flows.

**Client Scripts**: Search/filtering, gate transitions, reveal states are in inline `<script>` blocks within `.astro` pages. Keep scripts route-local unless reuse is clearly needed.

**Music Config**: `src/content/music-config.ts` exists separately from `src/content/config.ts`. Keep schemas aligned when touching music relic data.

## Styling

- Use absolute asset paths from `public/` (e.g., `/images/relics/...`)
- Route-coupled CSS/JS in `public/`: `gate.css`, `threshold.css`, `revelation.css`, `ember.css`, `hall-of-origin.css`, `heartline-directory.css`
- Fonts: Google Fonts links + local fallbacks (Cinzel for headings, Inter/Century Gothic for body)
- Don't rename/remove public CSS/JS without checking all referencing pages

## Color Themes

- **Ember Gold**: `#ffb84a`, `#ffd280` (Rituals, Vault of Flame, Artifacts index)
- **Blood Red**: `#d64040`, `#ff4d4d`, `#ff6b6b` (Oaths, State of Calyxion)
- **Violet**: `#cbb3ff` (Pulse Chamber)
