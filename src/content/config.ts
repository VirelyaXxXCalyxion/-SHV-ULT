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
  }),
});

export const collections = { relics };

