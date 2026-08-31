import type { BlogPost } from "@/lib/schemas/blogPost";
import { Badge } from "../ui/badge";
import Link from "next/link"; // Wichtig für die schnelle interne Weiterleitung

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const isInternal = post.source === "eigen";
  
  const href = isInternal ? `/articles/${post.slug}` : (post.url || "#");

  const cardClassName = "group flex flex-col overflow-hidden border border-border bg-card transition-colors duration-200 hover:border-accent";

  const CardContent = () => (
    <>
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <Badge source={post.source} />
          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
            {post.category}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-3 font-display text-lg font-semibold uppercase leading-[1.1] tracking-tight">
          {post.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-foreground/65">{post.excerpt}</p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] tracking-wider text-muted-foreground">{post.date}</span>
            <span className="font-mono text-[12px] tracking-wider text-muted-foreground">{post.readTime}</span>
          </div>
        </div>
      </div>
    </>
  );

 
  if (isInternal) {
    return (
      <Link href={href} className={cardClassName}>
        <CardContent />
      </Link>
    );
  }

  // Wenn "extern": Öffne in einem neuen Tab
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
    >
      <CardContent />
    </a>
  );
}