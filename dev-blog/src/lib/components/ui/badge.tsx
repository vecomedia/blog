interface BadgeProps {
  source: "eigen" | "extern";
}

export function Badge({ source }: BadgeProps) {
  if (source === "eigen") {
    return (
      <span className="inline-flex items-center gap-1 border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
        Eigene
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 border  px-4 py-2 font-mono text-[12px] uppercase tracking-[0.22em] text-muted-foreground">
      Extern
    </span>
  );
}