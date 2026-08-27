interface HeaderProps {
  totalCount: number;
  externalCount: number;
  internalCount: number;
}

export function Header({ totalCount, externalCount, internalCount }: HeaderProps) {
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

      {/* Filters — static counts for now, not yet wired to actual filtering */}
      <div className="flex items-center gap-0 border-t border-white/10 px-7 lg:px-12">
        <button className="relative px-5 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-accent">
          Alle
          <span className="ml-2 text-accent/70">{totalCount}</span>
        </button>
        <button className="px-5 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-primary-foreground/40">
          Extern
          <span className="ml-2 text-primary-foreground/25">{externalCount}</span>
        </button>
		   <button className="px-5 py-4 font-mono text-[12px] uppercase tracking-[0.25em] text-primary-foreground/40">
          Eigene
          <span className="ml-2 text-primary-foreground/25">{internalCount}</span>
        </button>
      </div>
    </header>
  );
}