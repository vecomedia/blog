// app/api/posts/route.ts
//
// Exposes the latest posts (local + external) as JSON so external sites
// (e.g. a PHP portfolio on a different host) can render a teaser list.
//
// GET https://your-blog.vercel.app/api/posts?limit=3
 
import { NextRequest, NextResponse } from "next/server";
import { fetchExternalArticles } from "@/lib/api/news";
import { getAllArticlesAsPosts } from "@/lib/api/articles";
 
// Revalidate the route's cache every 15 min (ISR). Vercel will serve a
// cached response between revalidations instead of re-running this on
// every request.
export const revalidate = 900;
 
// Restrict which origins are allowed to call this from a browser.
// Doesn't affect server-to-server calls (like PHP's curl), only fetch()
// calls made directly from someone's browser tab.
const ALLOWED_ORIGIN = "https://blog-nu-steel-78.vercel.app//"
 
export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 3, 1), 20);
 
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
 
  const posts = [...local, ...external]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    // Only send what the PHP teaser card actually needs — keep the
    // payload small and avoid leaking internal fields.
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      readTime: post.readTime  ?? null,
      tags: post.tags ?? [],
      source: post.source, // "eigen" | "extern"
      url: `${request.nextUrl.origin}/articles/${post.slug}`,
    }));
 
  const error =
    externalResult.status === "rejected" && localResult.status === "rejected"
      ? "Unbekannter Fehler"
      : null;
 
  return NextResponse.json(
    { posts, error },
    {
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400",
      },
    }
  );
}
 
