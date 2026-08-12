// lib/api/posts.ts
import { fetchExternalArticles } from "@/lib/api/news";
import { getAllArticlesAsPosts } from "@/lib/api/articles";
import type { BlogPost } from "@/lib/schemas/blogPost";

export async function getAllPosts(): Promise<BlogPost[]> {
  const [external, local] = await Promise.all([
    fetchExternalArticles("frontend"),
    Promise.resolve(getAllArticlesAsPosts()),
  ]);

  return [...local, ...external].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
}