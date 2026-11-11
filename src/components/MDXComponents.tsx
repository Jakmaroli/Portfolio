/**
 * Custom components for MDX rendering in case studies.
 *
 * Every standard Markdown element gets styled to match the portfolio's
 * dark theme. Headings get IDs from rehype-slug so the sidebar ToC
 * can link to them.
 */

import type { ComponentPropsWithoutRef } from "react";

type HP = ComponentPropsWithoutRef<"h2">;
type PP = ComponentPropsWithoutRef<"p">;
type AP = ComponentPropsWithoutRef<"a">;
type ULP = ComponentPropsWithoutRef<"ul">;
type OLP = ComponentPropsWithoutRef<"ol">;
type LIP = ComponentPropsWithoutRef<"li">;
type BQP = ComponentPropsWithoutRef<"blockquote">;
type PreP = ComponentPropsWithoutRef<"pre">;
type CodeP = ComponentPropsWithoutRef<"code">;
type TableP = ComponentPropsWithoutRef<"table">;
type THP = ComponentPropsWithoutRef<"th">;
type TDP = ComponentPropsWithoutRef<"td">;
type HRP = ComponentPropsWithoutRef<"hr">;

export const mdxComponents = {
  h2: (props: HP) => (
    <h2
      className="mb-4 mt-12 scroll-mt-24 border-b border-border pb-2 font-mono text-lg font-semibold text-foreground first:mt-0"
      {...props}
    />
  ),
  h3: (props: HP) => (
    <h3
      className="mb-3 mt-8 scroll-mt-24 font-mono text-base font-semibold text-foreground"
      {...props}
    />
  ),
  p: (props: PP) => (
    <p className="mb-4 leading-relaxed text-muted" {...props} />
  ),
  a: (props: AP) => (
    <a
      className="text-lane-oss underline underline-offset-2 transition-colors hover:text-foreground"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props: ULP) => (
    <ul className="mb-4 ml-4 list-disc space-y-1 text-muted" {...props} />
  ),
  ol: (props: OLP) => (
    <ol className="mb-4 ml-4 list-decimal space-y-1 text-muted" {...props} />
  ),
  li: (props: LIP) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: BQP) => (
    <blockquote
      className="mb-4 border-l-4 border-lane-main/40 pl-4 italic text-muted"
      {...props}
    />
  ),
  pre: (props: PreP) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm"
      {...props}
    />
  ),
  code: (props: CodeP) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm text-lane-main"
      {...props}
    />
  ),
  table: (props: TableP) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: THP) => (
    <th
      className="border border-border bg-surface px-3 py-2 text-left font-mono text-xs text-muted"
      {...props}
    />
  ),
  td: (props: TDP) => (
    <td className="border border-border px-3 py-2 text-muted" {...props} />
  ),
  hr: (props: HRP) => (
    <hr className="my-8 border-border" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};
