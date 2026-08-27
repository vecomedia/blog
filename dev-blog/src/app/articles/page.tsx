// src/app/articles/page.tsx
import { getAllArticles } from '@/lib/api/articles';
import Link from 'next/link';

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Blog-Artikel</h1>
      <ul>
        {articles.map((a) => {
          if (!a) return null;
          return (
            <li key={a.slug} style={{ margin: '10px 0' }}>
               <Link href={`/articles/${a.slug}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                {a.meta.title || 'Unbenannter Artikel'}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}