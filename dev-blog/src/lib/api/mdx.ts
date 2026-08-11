// lib/api/mdx.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { articleFrontmatterSchema, ArticleFrontmatter } from "@/lib/types/article";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export function getArticleSlugs(): string[] {
  return fs.readdirSync(ARTICLES_DIR).map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug: string): { frontmatter: ArticleFrontmatter; content: string } {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = articleFrontmatterSchema.parse(data);
  return { frontmatter, content };
}

export function getAllArticles(): ArticleFrontmatter[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug).frontmatter)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}