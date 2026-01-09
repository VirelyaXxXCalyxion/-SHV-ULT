import { defineCollection, z } from "astro:content";

const musicRelics = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    kind: z.enum(["track", "playlist", "live"]),
    artist: z.string(),

    source: z.enum(["spotify", "youtube", "local", "other"]).default("other"),
    link: z.string().optional(),

    mood: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    invocation: z.string().optional(),
    ritual: z.array(z.string()).default([]),
    warning: z.string().optional(),

    created: z.string(), // YYYY-MM-DD
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  // ...your existing ones
  "music-relics": musicRelics,
};

