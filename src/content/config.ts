import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content", // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    published: z.boolean().optional(),
  }),
});

const highlightsCollection = defineCollection({
  type: "data", // v2.5.0 and later
  schema: z.array(
    z.object({
      book: z.string(),
      author: z.string(),
      quote: z.string(),
      location: z.object({
        start: z.number().nullable(),
        end: z.number().nullable(),
      }),
      dateAdded: z.number(),
    }),
  ),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  "posts": blogCollection,
  "highlights": highlightsCollection,
};
