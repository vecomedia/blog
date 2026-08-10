import { fetchExternalArticles } from "@/lib/api/news";
import { FeaturedArticleCard } from "@/lib/components/articles/FeaturedArticleCard";
import { EmptyState } from "@/lib/components/ui/emptyState";
import { ErrorState } from "@/lib/components/ui/errorState";
import type { BlogPost } from "@/lib/schemas/blogPost";
import { Header } from "@/lib/components/layout/header";
import { ArticleGrid } from "@/lib/components/articles/ArticleGrid";

async function getPosts(): Promise<{ posts: BlogPost[]; error: string | null }> {
  try {
    const posts = await fetchExternalArticles("frontend");
    return { posts, error: null };
  } catch (err) {
    console.error("Failed to fetch external articles:", err);
    return {
      posts: [],
      error: err instanceof Error ? err.message : "Unbekannter Fehler",
    };
  }
}

export default async function Home() {
  const { posts, error } = await getPosts();

  const visibleFeatured = posts[0] ?? null;
  const visibleRest = posts.slice(1);

  return (
    <>
      <Header totalCount={posts.length} externalCount={posts.length} />

      <main className="space-y-8 px-7 py-12 lg:px-12 lg:py-16">
        {error && <ErrorState message={error} />}
        {!error && visibleFeatured && <FeaturedArticleCard post={visibleFeatured} />}
        {!error && <ArticleGrid posts={visibleRest} />}
        {!error && !visibleFeatured && visibleRest.length === 0 && <EmptyState />}
      </main>
    </>
  );
}