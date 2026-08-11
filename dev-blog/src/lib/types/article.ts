// types/article.ts
import { z } from "zod";

export const articleFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  excerpt: z.string(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;