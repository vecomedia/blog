"use client";

export type ArticleFilter = "all" | "external" | "internal";

interface HeaderProps {
  totalCount: number;
  externalCount: number;
  internalCount: number;
  activeFilter: ArticleFilter;
  onFilterChange: (filter: ArticleFilter) => void;
}

const filterButtonBase =
  "relative px-5 py-4 font-mono text-[12px] uppercase tracking-[0.25em] transition-colors";

export function Header({
  totalCount,
  externalCount,
  internalCount,
  activeFilter,
  onFilterChange,
}: HeaderProps) {
  const filters: { key: ArticleFilter; label: string; count: number }[] = [
    { key: "all", label: "Alle", count: totalCount },
    { key: "external", label: "Extern", count: externalCount },
    { key: "internal", label: "Eigene", count: internalCount },
  ];

  return (
    <header className="bg-primary pt-14 text-primary-foreground">
      <div className="flex flex-col justify-between gap-8 px-7 py-14 lg:flex-row lg:items-end lg:px-12 lg:py-20">
        <div>
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.3em] text-accent">
            Arbeitsnotizen
          </p>
          <h1 className="font-display text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight text-accent-foreground">
            Artikel &
            <br />
            <span className="rainbow-accent text-accent">Notizen</span>
          </h1>
        </div>
        <p className="max-w-xs pb-1 text-sm leading-relaxed text-primary-foreground/40 font-mono lg:text-right">
          Eigene Praxisbeiträge und externe Quellen zu Frontend-Architektur,
          TypeScript, API-Integration und Entwicklungs-Workflows.
        </p>
      </div>

      <div className="flex items-center gap-0 border-t border-white/10 px-7 lg:px-12">
        {filters.map(({ key, label, count }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              aria-pressed={isActive}
              className={`${filterButtonBase} ${
				isActive
					? "text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent"
					: "text-primary-foreground/40 hover:text-primary-foreground/70"
				}`}
            >
              {label}
              <span className={`ml-2 ${isActive ? "text-accent/70" : "text-primary-foreground/25"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}