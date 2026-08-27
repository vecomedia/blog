// src/app/articles/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getArticleSlugs } from "@/lib/api/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import { mdxComponents } from "@/lib/components/ui/mdx-components";
import { MoreArticles } from "@/lib/components/articles/MoreArticles";

import { fetchExternalArticles } from "@/lib/api/news";
import { getAllArticlesAsPosts } from "@/lib/api/articles";
import type { BlogPost } from "@/lib/schemas/blogPost";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

async function getMorePosts(currentSlug: string): Promise<BlogPost[]> {
  const [externalResult, localResult] = await Promise.allSettled([
    fetchExternalArticles("frontend"),
    Promise.resolve(getAllArticlesAsPosts()),
  ]);

  const external = externalResult.status === "fulfilled" ? externalResult.value : [];
  const local = localResult.status === "fulfilled" ? localResult.value : [];

  const allPosts = [...local, ...external].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return allPosts.filter((post) => post.slug !== currentSlug);
}

function formatDateDe(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  let article;
  try {
    article = getArticleBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }
  const suggestedArticles = await getMorePosts(resolvedParams.slug);
  
  const { frontmatter, content } = article;
  const isOwn = frontmatter.source === "eigen";

  return (
    <main className="bg-secondary">
      {frontmatter.image && (
        <div className="relative h-84 bg-muted md:h-80">
          <img
            src={frontmatter.image}
            alt={frontmatter.imageAlt ?? frontmatter.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/35" />
        </div>
      )}

      <article
        className={`overflow-hidden border border-border bg-primary text-white ${
          frontmatter.image ? "relative -mt-16 md:-mt-24" : ""
        }`}
      >
        <div className="p-8 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">          
              <span className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 font-mono text-[12px] uppercase tracking-[0.22em] text-card">
                Eigene
              </span>            
            {frontmatter.category && (
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                {frontmatter.category}
              </span>
            )}
            <time className="font-mono text-[12px] tracking-wider text-muted-foreground">
              {formatDateDe(frontmatter.publishedAt)}
            </time>
            {frontmatter.readTime && (
              <>
                <span className="font-mono text-[12px] text-muted-foreground/40">
                  ·
                </span>
                <span className="font-mono text-[12px] tracking-wider text-muted-foreground">
                  {frontmatter.readTime}
                </span>
              </>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-heading ">
            {frontmatter.title}
          </h1>

          {frontmatter.excerpt && (
            <p className="mb-8 leading-relaxed text-white">
              {frontmatter.excerpt}
            </p>
          )}

          <div className="prose prose-neutral max-w-none space-y-5 border-t border-border text-sm leading-relaxed text-white [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-tight">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.2em] text-white transition-colors hover:border-accent hover:text-accent"
            >
              Zurück zu Notizen
            </Link>
          </div>
        </div>
      </article>
      <MoreArticles posts={suggestedArticles}/>
    </main>
  );
}
