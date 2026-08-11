// src/app/articles/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getArticleSlugs } from "@/lib/api/mdx";
import { notFound } from "next/navigation";

// Wichtig für Next.js 15: Typisierung der Params als Promise
interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  // Params auflösen für Next.js 15 Kompatibilität
  const resolvedParams = await params;
  
  let article;
  try {
    article = getArticleBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  // Hier lag der Fehler: Es heißt frontmatter, nicht meta!
  const { frontmatter, content } = article;

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{frontmatter.title}</h1>
      {/* publishedAt statt date nutzen, da es so im Schema definiert ist */}
      <time>{frontmatter.publishedAt}</time>
      
      <div className="prose" style={{ marginTop: '2rem' }}>
        <MDXRemote source={content} />
      </div>
    </article>
  );
}