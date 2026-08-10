import { fetchExternalArticles } from "@/lib/api/news";

export default async function Home() {
  const posts = await fetchExternalArticles("frontend");

  const visibleFeatured = posts[0] ?? null;
  const visibleRest = posts.slice(1);

  return (
    <>
      {/* Header */}
      <header className="bg-primary pt-14 text-primary-foreground">
        <div className="flex flex-col justify-between gap-8 px-7 py-14 lg:flex-row lg:items-end lg:px-12 lg:py-20">
          <div>
            <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.3em] text-accent">
              Arbeitsnotizen
            </p>

            <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight text-primary-foreground">
              Artikel &
              <br />
              <span className="rainbow-accent text-accent">
                Notizen
              </span>
            </h1>
          </div>

          <p className="max-w-xs pb-1 text-sm leading-relaxed text-primary-foreground/50 lg:text-right">
            Eigene Praxisbeiträge und externe Quellen zu Frontend-Architektur,
            TypeScript, API-Integration und Entwicklungs-Workflows.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-0 border-t border-white/10 px-7 lg:px-12">
          <button
            className="relative px-5 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
          >
            Alle
            <span className="ml-2 text-accent/70">
              {posts.length}
            </span>
          </button>

          <button className="px-5 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-primary-foreground/40">
            Extern
            <span className="ml-2 text-primary-foreground/25">
              {posts.length}
            </span>
          </button>
        </div>
      </header>

      {/* Articles */}
      <main className="space-y-8 px-7 py-12 lg:px-12 lg:py-16">
        {/* Featured article */}
        {visibleFeatured && (
          <a
            href={visibleFeatured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-1 overflow-hidden border border-border bg-card transition-colors duration-200 hover:border-accent lg:grid-cols-[3fr_2fr]"
          >
            <div className="relative h-64 overflow-hidden bg-muted lg:h-auto">
              <img
                src={visibleFeatured.image}
                alt={visibleFeatured.imageAlt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-primary/20" />

              <div className="absolute left-4 top-4">
                <span className="bg-accent px-2 py-1 font-mono text-[12px] uppercase tracking-[0.22em] text-white">
                  Featured
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-card p-8 lg:p-10">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
                    Extern
                  </span>

                  <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {visibleFeatured.category}
                  </span>
                </div>

                <h2 className="mb-4 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold uppercase leading-[1.05] tracking-tight text-primary">
                  {visibleFeatured.title}
                </h2>

                <p className="text-sm leading-relaxed text-foreground/70">
                  {visibleFeatured.excerpt}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] tracking-wider text-muted-foreground">
                    {visibleFeatured.date}
                  </span>

                  <span className="font-mono text-[12px] text-muted-foreground/50">
                    ·
                  </span>

                  <span className="font-mono text-[12px] tracking-wider text-muted-foreground">
                    {visibleFeatured.readTime}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.2em] text-accent transition-all duration-200 group-hover:gap-2.5">
                  Lesen
                </span>
              </div>
            </div>
          </a>
        )}

        {/* Remaining articles */}
        {visibleRest.length > 0 && (
          <div className="grid grid-cols-1 gap-6 bg-border md:grid-cols-2 xl:grid-cols-3">
            {visibleRest.map((post) => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden border border-border bg-card transition-colors duration-200 hover:border-accent"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
                      Extern
                    </span>

                    <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="mb-3 line-clamp-3 font-display text-lg font-semibold uppercase leading-[1.1] tracking-tight text-primary">
                    {post.title}
                  </h3>

                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-foreground/65">
                    {post.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] tracking-wider text-muted-foreground">
                        {post.date}
                      </span>

                      <span className="font-mono text-[12px] text-muted-foreground/40">
                        ·
                      </span>

                      <span className="font-mono text-[12px] tracking-wider text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!visibleFeatured && visibleRest.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-muted-foreground">
              Keine Beiträge gefunden
            </p>
          </div>
        )}
      </main>
    </>
  );
}

