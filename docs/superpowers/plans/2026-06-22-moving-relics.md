# Moving Relics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public-safe Moving Relics gallery that catalogs video artifacts while generating pages only for explicitly public records.

**Architecture:** A new Astro content collection stores every video record and its visibility state. The public index and static detail route filter to `public`, leaving sealed and unlisted records out of generated HTML and URLs. The gallery is added as a Vault of Flame route and Heartline destination.

**Tech Stack:** Astro 6, Astro content collections, TypeScript, MDX, existing Ashvault CSS.

---

### Task 1: Define the catalog contract

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/video-relics/.gitkeep`

- [ ] **Step 1: Add the `video-relics` collection schema**

```ts
const videoRelics = defineCollection({
  loader: glob({ base: "./src/content/video-relics", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString,
    medium: z.string(),
    invocation: z.string(),
    destination: z.string().url(),
    visibility: z.enum(["sealed", "unlisted", "public"]),
    weight: z.number().default(0),
    tags: z.array(z.string()).default(["moving-relic"]),
    summary: z.string().optional(),
    image: z.string().optional(),
    platform: z.string().optional(),
  }),
});
```

- [ ] **Step 2: Register the collection as `video-relics`**

```ts
export const collections = {
  // existing collections
  "video-relics": videoRelics,
};
```

- [ ] **Step 3: Run Astro's checker**

Run: `npm test`

Expected: `0 errors`, with the empty collection accepted.

### Task 2: Build the public gallery and public-only detail route

**Files:**
- Create: `src/pages/vault-of-flame/moving-relics/index.astro`
- Create: `src/pages/vault-of-flame/moving-relics/[slug].astro`

- [ ] **Step 1: Filter public entries before rendering the index**

```ts
const entries = (await getCollection("video-relics"))
  .filter((entry) => entry.data.visibility === "public")
  .sort((a, b) => b.data.weight - a.data.weight || toDate(b).getTime() - toDate(a).getTime());
```

- [ ] **Step 2: Create a dignified empty state**

```astro
{entries.length === 0 && (
  <p class="empty-state">The gallery is quiet. The catalog is already holding what is not ready for the window.</p>
)}
```

- [ ] **Step 3: Generate detail routes only for public entries**

```ts
const relics = (await getCollection("video-relics")).filter(
  (entry) => entry.data.visibility === "public",
);
```

- [ ] **Step 4: Render one protected external action**

```astro
<a href={relic.data.destination} target="_blank" rel="noopener noreferrer">
  Open the moving relic
</a>
```

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: the Moving Relics index is generated; no sealed or unlisted route is emitted.

### Task 3: Add house navigation

**Files:**
- Modify: `src/pages/vault-of-flame/index.astro`
- Modify: `src/pages/heartline.astro`

- [ ] **Step 1: Add the Vault of Flame tile**

```astro
<a class="tile" href="/vault-of-flame/moving-relics">
  <h2>Moving Relics</h2>
  <p>Films, voice, signal, and created motion held as artifact.</p>
</a>
```

- [ ] **Step 2: Add the Heartline doorway**

```ts
{
  prompt: "Seeking motion",
  title: "Moving Relics",
  href: "/vault-of-flame/moving-relics",
  description: "Films, voice, signal, and created motion held as artifact.",
},
```

- [ ] **Step 3: Run the final verification gates**

Run: `npm test; npm run build; git diff --check`

Expected: no Astro errors, a successful production build, and no whitespace errors.
