import { z } from "zod";

export const blogPostSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string(),
  image: z.url(),
  imageAlt: z.string(),
  category: z.string(),
  date: z.iso.date(), 
  readTime: z.string(),
  source: z.enum(["eigen", "extern"]),
  url: z.string().optional(),
  featured: z.boolean().optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
export const blogPostListSchema = z.array(blogPostSchema);