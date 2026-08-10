interface BadgeProps {
  source: "eigen" | "extern";
}

export function Badge({ source }: BadgeProps) {
  if (source === "eigen") {
    return (
      <span className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 font-mono text-[12px] uppercase tracking-[0.22em] text-accent-foreground">
        Eigene
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
      Extern
    </span>
  );
}