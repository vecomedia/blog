import { blogPostListSchema, type BlogPost } from "@/lib/schemas/blogPost"

const GNEWS_BASE_URL = "https://gnews.io/api/v4/search";

// Raw shape exactly as GNews returns it (docs.gnews.io/json-response)
interface GNewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string; // ISO 8601, UTC, e.g. "2025-09-30T19:38:25Z"
  lang: string;
  source: {
    id: string;
    name: string;
    url: string;
    country?: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

interface GNewsErrorResponse {
  errors: string[] | Record<string, string>;
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} Min.`;
}

function mapToBlogPost(article: GNewsArticle, category: string): BlogPost {
  return {
    id: article.id,
    slug: article.id,
    title: article.title,
    excerpt: article.description,
    image: article.image ?? "https://via.placeholder.com/800x500",
    imageAlt: article.title,
    category,
    date: article.publishedAt.split("T")[0], // "2025-09-30T19:38:25Z" -> "2025-09-30"
    readTime: estimateReadTime(article.content),
    source: "extern",
    url: article.url,
  };
}

export async function fetchExternalArticles(
  query: string = "technology"
): Promise<BlogPost[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not set");
  }

  const params = new URLSearchParams({
    q: query,
    lang: "en",
    apikey: apiKey,
  });

  const res = await fetch(`${GNEWS_BASE_URL}?${params}`);

  if (!res.ok) {
    const errorBody: GNewsErrorResponse = await res.json().catch(() => ({ errors: [] }));
    throw new Error(
      `GNews request failed (${res.status}): ${JSON.stringify(errorBody.errors)}`
    );
  }

  const data: GNewsResponse = await res.json();
  const mapped = data.articles.map((article) => mapToBlogPost(article, query));

  return blogPostListSchema.parse(mapped);
}