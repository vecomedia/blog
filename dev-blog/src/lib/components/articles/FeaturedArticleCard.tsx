import type { BlogPost } from "@/lib/schemas/blogPost";
import { Badge } from "@/lib/components/ui/badge";
import Link from "next/link"; // 1. Next.js Link importieren

interface FeaturedArticleCardProps {
  post: BlogPost;
}

export function FeaturedArticleCard({ post }: FeaturedArticleCardProps) {
  // 2. Prüfen, ob es ein eigener Artikel ist
  const isInternal = post.source === "eigen";
  
  // 3. Pfad bestimmen: Entweder interne Route über den Slug oder externe URL
  const href = isInternal ? `/articles/${post.slug}` : (post.url || "#");

  // Die CSS-Klassen für das Layout bleiben absolut identisch
  const cardClassName = "group grid grid-cols-1 overflow-hidden border border-border bg-card transition-colors duration-200 hover:border-accent lg:grid-cols-[3fr_2fr]";

  // Der gesamte innere Inhalt der Featured Card
  const CardContent = () => (
    <>
      <div className="relative h-64 overflow-hidden bg-muted lg:h-auto">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute left-4 top-4">
          <span className="bg-accent px-4 py-2 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
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
          <h2 className="mb-4 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold uppercase leading-[1.05] tracking-tight text-primary">
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
          <span className="veco-btn inline-flex items-center gap-2 border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:border-accent hover:text-accent">
            Lesen
          </span>
        </div>
      </div>
    </>
  );

  // 4. Bedingtes Rendering: Next.js Link für intern, normales <a> für externe Links
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
