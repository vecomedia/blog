interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-32 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-muted-foreground">
        Artikel konnten nicht geladen werden
      </p>
      {message && (
        <p className="max-w-md text-sm text-foreground/50">{message}</p>
      )}
    </div>
  );
}