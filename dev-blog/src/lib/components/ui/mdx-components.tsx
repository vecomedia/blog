// src/lib/mdx-components.tsx
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="mt-8 mb-4 text-2xl font-bold text-heading" {...props} />
  ),
  h2: (props) => (
    <h2 className="font-display mb-3 text-lg font-semibold uppercase tracking-tight text-primary" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-2 text-base font-semibold text-heading" {...props} />
  ),
  p: (props) => (
    <p className="leading-relaxed text-foreground/80" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: (props) => (
    <a className="text-accent underline underline-offset-2 hover:text-accent/80" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="my-6 border-l-2 border-accent bg-muted/40 py-2 pl-4 text-foreground/70 italic" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-accent" {...props} />
  ),
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded border border-border bg-muted/60 p-4 font-mono text-[13px] leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-foreground/80" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5 text-foreground/80" {...props} />
  ),
};