import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    price: z.number().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { products };
