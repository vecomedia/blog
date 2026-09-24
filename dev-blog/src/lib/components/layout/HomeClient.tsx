"use client";

import { useState } from "react";
import { Header, type ArticleFilter } from "@/lib/components/layout/header";
import { ArticleGrid } from "@/lib/components/articles/ArticleGrid";
import { FeaturedArticleCard } from "@/lib/components/articles/FeaturedArticleCard";
import { EmptyState } from "@/lib/components/ui/emptyState";
import { ErrorState } from "@/lib/components/ui/errorState";
import type { BlogPost } from "@/lib/schemas/blogPost";

export function HomeClient({ posts, error }: { posts: BlogPost[]; error: string | null }) {
  const [filter, setFilter] = useState<ArticleFilter>("all");

  const filteredPosts = posts.filter((p) => {
    if (filter === "all") return true;
    return filter === "external" ? p.source === "extern" : p.source === "eigen";
  });

  const visibleFeatured = filteredPosts[0] ?? null;
  const visibleRest = filteredPosts.slice(1);
  const externalCount = posts.filter((p) => p.source === "extern").length;
  const internalCount = posts.filter((p) => p.source === "eigen").length;

  return (
    <>
      <Header
        totalCount={posts.length}
        externalCount={externalCount}
        internalCount={internalCount}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <main className="space-y-8 px-7 py-12 lg:px-12 lg:py-16">
        {error && <ErrorState message={error} />}
        {!error && visibleFeatured && <FeaturedArticleCard post={visibleFeatured} />}
        {!error && <ArticleGrid posts={visibleRest} />}
        {!error && !visibleFeatured && visibleRest.length === 0 && <EmptyState />}
      </main>
    </>
  );
}