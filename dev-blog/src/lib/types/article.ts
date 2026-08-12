// types/article.ts
import { z } from "zod";

export const articleFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  publishedAt: z.string(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  excerpt: z.string(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  category: z.string().optional(),
  readTime: z.string().optional(),
  source: z.enum(["eigen", "extern"]).optional(),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;