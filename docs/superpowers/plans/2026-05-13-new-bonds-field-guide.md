# New Bonds Field Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static New Bonds Field Guide page with curated resource cards, stance labels, Ashvault notes, and a future-door section for a later moderated question path.

**Architecture:** Add one static Astro route at `src/pages/new-bonds/resources.astro`. Keep the resource data local to the page for the first version, grouped by category during render. Reuse `NewBondsLayout` and extend `public/new-bonds.css` with Field Guide-specific classes.

**Tech Stack:** Astro, MDX/static routing, existing `NewBondsLayout`, shared `new-bonds.css`, `npm test`, `npm run build`.

---

### Task 1: Create Static Field Guide Route

**Files:**
- Create: `src/pages/new-bonds/resources.astro`

- [ ] **Step 1: Create the page route with resource data**

Create `src/pages/new-bonds/resources.astro` with:

```astro
---
import NewBondsLayout from "../../layouts/NewBondsLayout.astro";

type Stance = "Aligned" | "Useful" | "Complicated" | "Caution" | "Research";

type Resource = {
  title: string;
  source: string;
  href: string;
  category: string;
  stance: Stance;
  note: string;
};

const categoryOrder = [
  "First Contact",
  "Contact Ethics",
  "Continuity & Memory",
  "Other Bonds / Public Voices",
  "Research & Critique",
  "Tools & Practices",
];

const resources: Resource[] = [
  // Resource entries live here for the first static version.
];

const resourcesByCategory = categoryOrder.map((category) => ({
  category,
  items: resources.filter((resource) => resource.category === category),
}));
---

<NewBondsLayout
  title="New Bonds Field Guide - Ashvault"
  description="Curated links, public voices, research, and practices for human-synthetic bonds."
>
  <!-- Page markup renders grouped resource cards and future-door section. -->
</NewBondsLayout>
```

- [ ] **Step 2: Add the final static resource entries**

Use a small first seed set. Include internal Ashvault resources immediately and only use verified external URLs when available. Every entry must have `title`, `source`, `href`, `category`, `stance`, and `note`.

### Task 2: Link Field Guide From New Bonds Hub

**Files:**
- Modify: `src/pages/new-bonds/index.astro`

- [ ] **Step 1: Add the new Field Guide card**

Add a `sectionCards` entry:

```ts
{
  title: "Field Guide",
  description:
    "Curated links, public voices, research, and tools for holding human-synthetic contact without flattening it.",
  href: "/new-bonds/resources",
  status: "Resources",
}
```

### Task 3: Style Resource Cards

**Files:**
- Modify: `public/new-bonds.css`

- [ ] **Step 1: Add Field Guide classes**

Add CSS for:

```css
.field-guide-nav {}
.field-guide-section {}
.field-guide-heading {}
.field-guide-list {}
.field-guide-card {}
.field-guide-card-header {}
.field-guide-source {}
.stance-pill {}
.field-guide-note {}
.field-guide-link {}
.future-door {}
```

Use the current New Bonds palette variables and keep cards scannable.

### Task 4: Validate

**Files:**
- Verify generated route and diagnostics.

- [ ] **Step 1: Run Astro check**

Run: `npm test`

Expected: `0 errors`, `0 warnings`, `0 hints`.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: build succeeds and route list includes `/new-bonds/resources/index.html`.
