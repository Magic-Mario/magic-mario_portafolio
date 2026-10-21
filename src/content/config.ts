import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown/MDX file per project. The filename is the slug and the public URL
 * segment, so adding a project means adding one file — no page or route edits.
 * See specs/001-project-portfolio/contracts/project-content.md.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(60),
      summary: z.string().min(20).max(160),
      tech: z.array(z.string()).min(1),
      order: z.number(),
      status: z.enum(['active', 'prototype', 'archived']).default('active'),
      year: z.string().optional(),
      role: z.string().optional(),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      cover: image().optional(),
      gallery: z.array(image()).default([]),
      featured: z.boolean().default(false),
    }),
});

export const collections = { projects };
