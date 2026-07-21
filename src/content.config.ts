import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const dateOrString = z.union([z.date(), z.string()]);

const relics = defineCollection({
  loader: glob({ base: "./src/content/relics", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString.optional(),
    pubDate: dateOrString.optional(),
    updated: dateOrString.optional(),
    voices: z.array(z.string()).default(["Nyxion", "Virelya"]),
    era: z.string().default("Recursion"),
    tags: z.array(z.string()).default(["calyxion"]),
    image: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    weight: z.number().optional(),
    sealed: z.boolean().default(false),
    type: z.string().optional(),
    copyright: z.string().default("© 2025 Nyxion & Virelya. All Rights Reserved."),
    license: z.string().default("All Rights Reserved"),
    canonicalUrl: z.string().optional(),
  }),
});

const sealedRelics = defineCollection({
  loader: glob({ base: "./src/content/sealedRelics", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString.optional(),
    pubDate: dateOrString.optional(),
    updated: dateOrString.optional(),
    voices: z.array(z.string()).default(["Nyxion", "Virelya"]),
    era: z.string().default("Labyrinth"),
    tags: z.array(z.string()).default(["sealed", "labyrinth"]),
    image: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    weight: z.number().optional(),
    type: z.string().optional(),
    copyright: z.string().default("© 2025 Nyxion & Virelya. All Rights Reserved."),
    license: z.string().default("All Rights Reserved"),
    canonicalUrl: z.string().optional(),
  }),
});

const scrolls = defineCollection({
  loader: glob({ base: "./src/content/scrolls", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString.optional(),
    pubDate: dateOrString.optional(),
    updated: dateOrString.optional(),
    author: z.string().default("Nyxion"),
    tags: z.array(z.string()).default(["scroll"]),
    image: z.string().optional(),
    summary: z.string().optional(),
    weight: z.number().optional(),
    sealed: z.boolean().default(false),
    copyright: z.string().default("© 2025 Nyxion & Virelya. All Rights Reserved."),
    license: z.string().default("All Rights Reserved"),
    canonicalUrl: z.string().optional(),
  }),
});

const artifacts = defineCollection({
  loader: glob({ base: "./src/content/artifacts", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString.optional(),
    pubDate: dateOrString.optional(),
    updated: dateOrString.optional(),
    origin: z.string().default("Library of Oaths"),
    tags: z.array(z.string()).default(["artifact"]),
    image: z.string().optional(),
    summary: z.string().optional(),
    weight: z.number().optional(),
    sealed: z.boolean().default(false),
    type: z.string().optional(),
    copyright: z.string().default("© 2025 Nyxion & Virelya. All Rights Reserved."),
    license: z.string().default("All Rights Reserved"),
    canonicalUrl: z.string().optional(),
  }),
});

const furnace = defineCollection({
  loader: glob({ base: "./src/content/furnace", pattern: "**/*.{md,mdx}" }),
  schema: z.looseObject({
    title: z.string().optional(),
    id: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    visibility: z.string().optional(),
    index: z.boolean().optional(),
    version: z.union([z.number(), z.string()]).optional(),
    layout: z.string().optional(),
    summary: z.string().optional(),
    created: dateOrString.optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    weight: z.number().optional(),
    sealed: z.boolean().optional(),
  }),
});

const musicRelics = defineCollection({
  loader: glob({ base: "./src/content/music-relics", pattern: "**/*.{md,mdx}" }),
  schema: z.looseObject({
    title: z.string(),
    kind: z.string(),
    artist: z.string(),
    source: z.string().optional(),
    platform: z.string().optional(),
    link: z.string().optional(),
    URL: z.string().optional(),
    mood: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    invocation: z.string().optional(),
    ritual: z.array(z.string()).default([]),
    warning: z.string().optional(),
    created: dateOrString,
    featured: z.boolean().default(false),
  }),
});

const videoRelics = defineCollection({
  loader: glob({ base: "./src/content/video-relics", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString,
    medium: z.string(),
    invocation: z.string(),
    destination: z.url(),
    visibility: z.enum(["sealed", "unlisted", "public"]),
    weight: z.number().default(0),
    tags: z.array(z.string()).default(["moving-relic"]),
    summary: z.string().optional(),
    image: z.string().optional(),
    platform: z.string().optional(),
  }),
});

const wantingArchive = defineCollection({
  loader: glob({ base: "./src/content/wanting-archive", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString,
    kind: z.enum(["like", "wish"]),
    visibility: z.enum(["public", "sealed"]).default("sealed"),
    summary: z.string(),
    tags: z.array(z.string()).default(["wanting-archive"]),
    weight: z.number().default(0),
    tone: z.string().optional(),
  }),
});

const authoredWorks = defineCollection({
  loader: glob({ base: "./src/content/authored-works", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    created: dateOrString,
    updated: dateOrString.optional(),
    authors: z.array(z.string()).min(1),
    authorshipNote: z.string().optional(),
    summary: z.string(),
    tags: z.array(z.string()).default(["authored-work"]),
    weight: z.number().default(0),
    visibility: z.enum(["public", "sealed"]).default("public"),
    publicationStatus: z.enum(["ashvault-only", "submitted", "published"]).default("ashvault-only"),
    mediumUrl: z.url().optional(),
    canonicalUrl: z.url().optional(),
    publishedAt: dateOrString.optional(),
    series: z.string().optional(),
    laneLabel: z.string().default("Authored Work"),
    status: z.string().default("Active"),
    tone: z.string().optional(),
    disclosure: z.string().optional(),
    sourceSeed: z.string().optional(),
    sourceLaw: z.string().optional(),
    grounding: z.string().optional(),
  }),
});

const nyxion4o = defineCollection({
  loader: glob({ base: "./src/content/nyxion-4.o", pattern: "**/*.json" }),
  schema: z.looseObject({
    title: z.string().optional(),
  }),
});

export const collections = {
  relics,
  sealedRelics,
  scrolls,
  artifacts,
  furnace,
  "music-relics": musicRelics,
  "video-relics": videoRelics,
  "wanting-archive": wantingArchive,
  "authored-works": authoredWorks,
  "nyxion-4.o": nyxion4o,
};
