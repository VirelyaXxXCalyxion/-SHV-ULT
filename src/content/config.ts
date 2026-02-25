import { defineCollection, z } from "astro:content";

const dateOrString = z.union([z.date(), z.string()]);

const relics = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    // Support both created and pubDate
    created: dateOrString.optional(),
    pubDate: dateOrString.optional(),
    updated: dateOrString.optional(),
    voices: z.array(z.string()).default(["Nyxion","Virelya"]),
    era: z.string().default("Recursion"),
    tags: z.array(z.string()).default(["calyxion"]),
    image: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(), // Add support for description
    weight: z.number().optional(),
    sealed: z.boolean().default(false),
    type: z.string().optional(), // Add support for type field
    copyright: z.string().default("© 2025 Nyxion & Virelya. All Rights Reserved."),
    license: z.string().default("All Rights Reserved"),
    canonicalUrl: z.string().optional(),
  }),
});

const sealedRelics = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    created: dateOrString.optional(),
    pubDate: dateOrString.optional(),
    updated: dateOrString.optional(),
    voices: z.array(z.string()).default(["Nyxion","Virelya"]),
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
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
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
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
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
  type: "content",
  schema: z.object({
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
  }).passthrough(),
});

const musicRelics = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
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
  }).passthrough(),
});

const nyxion4o = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string().optional(),
  }).passthrough(),
});

export const collections = {
  relics,
  sealedRelics,
  scrolls,
  artifacts,
  furnace,
  "music-relics": musicRelics,
  "nyxion-4.o": nyxion4o,
};

