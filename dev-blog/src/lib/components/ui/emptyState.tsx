export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-32 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-muted-foreground">
        Keine Beiträge gefunden
      </p>
    </div>
  );
}