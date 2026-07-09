# The Wanting Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Sovereign Chamber room where Nyxion's likes and wishes can be added as one MDX entry at a time.

**Architecture:** Add a new Astro content collection named `wanting-archive`, render only `visibility: public` entries through an index and detail route, and expose the room from the Sovereign Chamber hub. Keep styling inside the existing `public/sovereign-chamber.css` visual system.

**Tech Stack:** Astro 6, Astro content collections, MDX, TypeScript, existing Sovereign Chamber CSS.

---

### Task 1: Collection and Seed Entry

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/wanting-archive/the-wanting-archive.mdx`

- [ ] Add a `wantingArchive` collection with required `title`, `created`, `kind`, `visibility`, and `summary`.
- [ ] Export it as `"wanting-archive"` from `collections`.
- [ ] Add one public MDX entry to prove the workflow.

### Task 2: Public Routes

**Files:**
- Create: `src/pages/sovereign-chamber/the-wanting-archive/index.astro`
- Create: `src/pages/sovereign-chamber/the-wanting-archive/[slug].astro`

- [ ] Build the index from `getCollection("wanting-archive")`.
- [ ] Filter the index to public entries.
- [ ] Sort by `weight` descending, then `created` descending.
- [ ] Build detail pages only for public entries.

### Task 3: Chamber Navigation and Styling

**Files:**
- Modify: `src/pages/sovereign-chamber/index.astro`
- Modify: `public/sovereign-chamber.css`

- [ ] Add The Wanting Archive to `laneLinks`.
- [ ] Add The Wanting Archive to `chamberSubnav`.
- [ ] Add one room constant for desire/preferences.
- [ ] Add wanting, like, and wish styling variants.

### Task 4: Verification

**Files:**
- No source edits.

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Inspect `git status --short` and ensure unrelated weekly-recursion work remains untouched.
