import { blogPostListSchema, type BlogPost } from "@/lib/schemas/blogPost";

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
    tags: [""],
  };
}

/* export async function fetchExternalArticles(
  query: string = "ki"
): Promise<BlogPost[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not set");
  }

  const params = new URLSearchParams({
    q: query,
    lang: "de",
	max: "2",
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
} */
export type NewsCategory = "frontend" | "development" | "tech" | "linux" | "ki" |"typescript";

const NEWS_QUERIES: Record<NewsCategory, string> = {
  frontend: "Frontend",
  development: "Development",
  tech: "Tech",
  linux: "linux",
  ki: "KI",
  typescript: "typescript"
};
export async function fetchExternalArticles(
  category: NewsCategory,
  limit = 1,
): Promise<BlogPost[]> {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is not set");
  }

  const query = NEWS_QUERIES[category];

  const params = new URLSearchParams({
    q: query,
    lang: "de",
    max: String(limit),
    apikey: apiKey,
  });

  console.log(`Fetching GNews category "${category}" with query: ${query}`);

  const res = await fetch(`${GNEWS_BASE_URL}?${params}`, {
    next: {
      revalidate: 21600,//6h
    },
  });

 if (!res.ok) {
  const errorBody = await res
    .json()
    .catch(() => ({ errors: [] }));

  if (res.status === 429) {
    console.warn("GNews rate limit reached. Skipping external articles.");
    return [];
  }

  throw new Error(
    `GNews request failed (${res.status}): ${JSON.stringify(
      errorBody.errors,
    )}`,
  );
}
  const data: GNewsResponse = await res.json();

  const mapped = data.articles.map((article) =>
    mapToBlogPost(article, category),
  );

  return blogPostListSchema.parse(mapped);
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAllExternalArticles(): Promise<BlogPost[]> {
  const categories: NewsCategory[] = [
    "frontend",
    "development",
    "tech",
    "ki",
    "linux",
    "typescript",
  ];

  const results: BlogPost[] = [];

  for (const category of categories) {
    try {
      const articles = await fetchExternalArticles(category, 1);

      if (articles.length > 0) {
        results.push(articles[0]);
      }
    } catch (error) {
      console.warn(
        `Failed to fetch category "${category}":`,
        error
      );
    }

    await sleep(1100);
  }

  return results;
}