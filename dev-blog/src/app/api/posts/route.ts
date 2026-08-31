// src/app/api/posts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAllArticlesAsPosts } from "@/lib/api/articles";

// 6 Stunden Cache
export const revalidate = 21600;

const ALLOWED_ORIGIN = "https://blog-nu-steel-78.vercel.app";

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.min(
    Math.max(Number(limitParam) || 3, 1),
    20
  );

  try {
    const local = getAllArticlesAsPosts();

    const posts = local
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      )
      .slice(0, limit)
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        readTime: post.readTime ?? null,
        tags: post.tags ?? [],
        source: "eigen",
        url: `${request.nextUrl.origin}/articles/${post.slug}`,
      }));

    return NextResponse.json(
      { posts, error: null },
      {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Cache-Control":
            "s-maxage=21600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load local articles:", error);

    return NextResponse.json(
      {
        posts: [],
        error: "Failed to load articles",
      },
      { status: 500 }
    );
  }
}