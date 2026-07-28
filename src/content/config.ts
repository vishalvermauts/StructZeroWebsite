import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    version: z.string().optional(),
    lastUpdated: z.string().optional(),
    author: z.string().default('StructZero Engineering'),
  }),
});

const pluginsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['security', 'cloud', 'business', 'marketing', 'observability', 'billing', 'mcp', 'enterprise', 'search', 'social', 'analytics', 'crm']),
    status: z.enum(['LIVE', 'IN DEVELOPMENT', 'PLANNED']),
    icon: z.string().optional(),
    roadmap: z.string().optional(),
  }),
});

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.string(),
    order: z.number().default(1),
    lastUpdated: z.string().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('StructZero Core Team'),
    tags: z.array(z.string()).default([]),
  }),
});

const compareCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    targetTool: z.string(),
    category: z.string().default('AI Development Tool'),
    description: z.string(),
    verdict: z.string(),
  }),
});

export const collections = {
  pages: pagesCollection,
  plugins: pluginsCollection,
  docs: docsCollection,
  blog: blogCollection,
  compare: compareCollection,
};
