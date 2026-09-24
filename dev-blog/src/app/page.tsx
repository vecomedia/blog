import { fetchAllExternalArticles } from "@/lib/api/news";
import { getAllArticlesAsPosts } from "@/lib/api/articles";
import type { BlogPost } from "@/lib/schemas/blogPost";
import { HomeClient } from "@/lib/components/layout/HomeClient";

async function getPosts(): Promise<{ posts: BlogPost[]; error: string | null }> {
  const [externalResult, localResult] = await Promise.allSettled([
    fetchAllExternalArticles(),
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

  const error =
    externalResult.status === "rejected" && localResult.status === "rejected"
      ? "Unbekannter Fehler"
      : null;

  return { posts, error };
}

export default async function Home() {
  const { posts, error } = await getPosts();
  return <HomeClient posts={posts} error={error} />;
}