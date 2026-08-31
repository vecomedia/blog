import type { BlogPost } from "@/lib/schemas/blogPost";
import { ArticleCard } from "@/lib/components/articles/ArticleCard";

interface ArticleGridProps {
  posts: BlogPost[];
}

export function ArticleGrid({ posts }: ArticleGridProps) {
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 bg-border md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <ArticleCard key={`${post.source}-${post.slug}`} post={post} />
      ))}
    </div>
  );
}
