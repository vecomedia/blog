import type { BlogPost } from "@/lib/schemas/blogPost";
import { Badge } from "@/lib/components/ui/badge";
import Link from "next/link";

interface FeaturedArticleCardProps {
  post: BlogPost;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {

  const isInternal = post.source === "eigen";
  
  const href = isInternal ? `/articles/${post.slug}` : (post.url || "#");

  const cardClassName = "group block grid grid-cols-1 overflow-hidden border rounded-md bg-card transition-colors duration-200 hover:border-accent lg:grid-cols-[3fr_2fr]";

  // Der gesamte innere Inhalt der Featured Card
  const CardContent = () => (
    <>
      <div className="relative h-64 overflow-hidden bg-muted lg:h-auto">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
		   <img
          src={post.url}
          alt={post.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute left-4 top-4">
          <span className="bg-accent px-2 py-2 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
            Featured
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between bg-card p-8 lg:p-10">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Badge source={post.source} />
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              {post.category}
            </span>
          </div>
          <h2 className="mb-4 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold uppercase leading-[1.05] tracking-tight">
            {post.title}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70">{post.excerpt}</p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] tracking-wider text-muted-foreground">{post.date}</span>
            <span className="font-mono text-[12px] text-muted-foreground/50">·</span>
            <span className="font-mono text-[12px] tracking-wider text-muted-foreground">{post.readTime}</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.2em] text-accent transition-all duration-200 group-hover:gap-2.5">
            Lesen
          </span>
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
