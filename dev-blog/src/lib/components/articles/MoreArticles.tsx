import type { BlogPost } from "@/lib/schemas/blogPost";

import Link from "next/link";

interface MoreArticlesProps {
	posts:BlogPost[];
}

export function MoreArticles({ posts }: MoreArticlesProps) {
  
  const displayPosts = posts.slice(0, 2);

  if (displayPosts.length === 0) return null;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <p className="mb-4 text-[0.62rem] tracking-[0.15em] text-[#f0ead6]/50">
        WEITERE ARTIKEL
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {displayPosts.map((post) => {
          // Erstelle den passenden Link basierend auf der Quelle oder dem Typ
          const isExternal = post.source === "extern";
          const itemLink = isExternal 
            ? post.url // Falls externe Artikel eine direkte URL haben
            : `/articles/${post.slug}`; // Dein lokaler Pfad

          // Formatierung des Datums (z.B. 13.08.2026)
          const formattedDate = new Date(post.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return (
            <Link
              key={post.id || post.slug}
			  href={post.url || "#"}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="block rounded-[2px] border border-[#0b0f1a]/10 bg-[#f0ead6] p-5 no-underline transition duration-200 hover:-translate-y-0.5 hover:border-[#0b0f1a]/35"
            >
              {/* Tags/Kategorien */}
              <div className="mb-2 flex gap-1.5">
                {post.tags?.slice(0, 2).map((tag) => (
                  <span 
                    key={tag} 
                    className="rounded-[2px] border border-[#0b0f1a]/20 px-[5px] py-px text-[0.55rem] tracking-[0.1em] text-[#0b0f1a] uppercase"
                  >
                    {tag}
                  </span>
                )) || (
                  <span className="rounded-[2px] border border-[#0b0f1a]/20 px-[5px] py-px text-[0.55rem] tracking-[0.1em] text-[#0b0f1a]">
                    {post.source === "extern" ? "EXTERN" : "ARTIKEL"}
                  </span>
                )}
              </div>

              {/* Titel */}
              <p className="mb-1.5 text-[0.95rem] font-extrabold leading-[1.2] text-[#0b0f1a]">
                {post.title}
              </p>

              {/* Meta-Infos */}
              <p className="text-[0.58rem] text-[#0b0f1a]/45">
                {formattedDate} {post.readTime ? `· ${post.readTime} Min.` : ""}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
