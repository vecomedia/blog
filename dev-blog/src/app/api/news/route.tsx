import { NextResponse } from "next/server";
import { fetchAllExternalArticles } from "@/lib/api/news";

// 6 Hours Cache
export const revalidate = 21600;

export async function GET() {
  try {
    const news = await fetchAllExternalArticles();

    return NextResponse.json(
      {
        posts: news,
        error: null,
      },
      {
        headers: {
          "Cache-Control":
            "s-maxage=21600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Failed to load external news:", error);

    return NextResponse.json(
      {
        posts: [],
        error: "Failed to load external news",
      },
      { status: 500 }
    );
  }
}