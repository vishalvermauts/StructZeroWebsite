import { defineCollection, z } from 'astro:content';

const kbCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['Production', 'In Development', 'Planned', 'Official Spec', 'Operational']),
    summary: z.string().optional(),
    related: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    features: z.array(z.object({ title: z.string(), desc: z.string() })).default([]),
  }),
});

const pluginKbCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['Production', 'In Development', 'Planned']),
    category: z.string(),
    summary: z.string().optional(),
    useCases: z.array(z.string()).default([]),
    benefits: z.array(z.string()).default([]),
    related: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

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
    category: z.string(),
    status: z.enum(['LIVE', 'IN DEVELOPMENT', 'PLANNED', 'Production', 'In Development', 'Planned']),
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
  kb: kbCollection,
  pluginKb: pluginKbCollection,
  pages: pagesCollection,
  plugins: pluginsCollection,
  docs: docsCollection,
  blog: blogCollection,
  compare: compareCollection,
};
