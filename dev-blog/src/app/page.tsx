import { fetchExternalArticles } from "@/lib/api/news";
import { getAllArticlesAsPosts } from "@/lib/api/articles";
import { FeaturedArticleCard } from "@/lib/components/articles/FeaturedArticleCard";
import { EmptyState } from "@/lib/components/ui/emptyState";
import { ErrorState } from "@/lib/components/ui/errorState";
import type { BlogPost } from "@/lib/schemas/blogPost";
import { Header } from "@/lib/components/layout/header";
import { ArticleGrid } from "@/lib/components/articles/ArticleGrid";

async function getPosts(): Promise<{ posts: BlogPost[]; error: string | null }> {
  const [externalResult, localResult] = await Promise.allSettled([
    fetchExternalArticles("frontend"),
    Promise.resolve(getAllArticlesAsPosts()),
  ]);

  const external = externalResult.status === "fulfilled" ? externalResult.value : [];
  const local = localResult.status === "fulfilled" ? localResult.value : [];

  if (externalResult.status === "rejected") {
    console.error("Failed to fetch external articles:", externalResult.reason);
  }
  if (localResult.status === "rejected") {
    console.error("Failed to load local articles:", localResult.reason);
  }

  const posts = [...local, ...external].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Nur einen echten Fehler zeigen, wenn BEIDE Quellen fehlgeschlagen sind
  const error =
    externalResult.status === "rejected" && localResult.status === "rejected"
      ? "Unbekannter Fehler"
      : null;

  return { posts, error };
}

export default async function Home() {
  const { posts, error } = await getPosts();

  const visibleFeatured = posts[0] ?? null;
  const visibleRest = posts.slice(1);
  const externalCount = posts.filter((p) => p.source === "extern").length;
  const	internalCount = posts.filter((p) => p.source === "eigen").length;
  return (
    <>
      <Header totalCount={posts.length} externalCount={externalCount} internalCount={internalCount}/>

      <main className="space-y-8 px-7 py-12 lg:px-12 lg:py-16">
        {error && <ErrorState message={error} />}
        {!error && visibleFeatured && <FeaturedArticleCard post={visibleFeatured} />}
        {!error && <ArticleGrid posts={visibleRest} />}
        {!error && !visibleFeatured && visibleRest.length === 0 && <EmptyState />}
      </main>
    </>
  );
}