import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import type { BlogPost } from "@/lib/schemas/blogPost";

const articlesDir = path.join(process.cwd(), 'content/articles');

export function getAllArticles() {
  // 1. Debug-Log: Zeigt dir im Terminal den echten Pfad an
  console.log("Next.js sucht Artikel in:", articlesDir);

  // 2. Sicherheits-Check: Existiert der Ordner überhaupt?
  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ FEHLER: Der Ordner existiert nicht unter: ${articlesDir}`);
    return []; // Gibt ein leeres Array zurück statt abzustürzen
  }

  try {
    const files = fs.readdirSync(articlesDir);
    
    // 3. Sicherheits-Check: Ist der Ordner leer?
    if (files.length === 0) {
      console.warn("⚠️ WARNUNG: Der Ordner 'content/articles' ist leer.");
      return [];
    }

    return files.map((filename) => {
      const fullPath = path.join(articlesDir, filename);
      
      // Nur Dateien einlesen (verhindert Fehler durch versteckte Systemordner wie .DS_Store)
      if (fs.statSync(fullPath).isDirectory()) return null;

      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(raw);
      return { slug: filename.replace(/\.mdx?$/, ''), meta: data, content };
    }).filter(Boolean); // Filtert eventuelle null-Werte (Ordner) heraus

  } catch (error) {
    console.error("❌ Fehler beim Lesen der Artikel:", error);
    return [];
  }
}

type LocalArticle = NonNullable<ReturnType<typeof getAllArticles>[number]>;

function toBlogPost(article: LocalArticle): BlogPost {
  return {
    id: article.slug,
    slug: article.slug,
    title: article.meta.title ?? "Unbenannter Artikel",
    excerpt: article.meta.excerpt ?? "",
    image: article.meta.image ?? "",
    imageAlt: article.meta.imageAlt ?? "",
    category: article.meta.category ?? "",
    date: article.meta.date ?? "",
    readTime: article.meta.readTime ?? "",
    source: "eigen",
    featured: article.meta.featured,
  };
}

export function getAllArticlesAsPosts(): BlogPost[] {
  return getAllArticles()
    .filter((a): a is LocalArticle => Boolean(a))
    .map(toBlogPost);
}