"use client";

/**
 * CaseStudy — the PR-style layout for individual project pages.
 *
 * Structure:
 *   ┌──────────────────────────────────────────────────┐
 *   │ ← Back to log                                    │
 *   ├──────────────────────────────────────────────────┤
 *   │ Header card (hash, lane, date, stack, result)    │
 *   ├─────────────────────────────┬────────────────────┤
 *   │  MDX content                │  Table of Contents  │
 *   │  (PR sections)              │  (sticky sidebar)   │
 *   └─────────────────────────────┴────────────────────┘
 *
 * On mobile: single column, no ToC sidebar.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Lane } from "@/data/commits";
import { EASE, DUR } from "@/lib/motion";
import TableOfContents from "@/components/TableOfContents";

export interface CaseStudyFrontmatter {
  title: string;
  summary: string;
  hash: string;
  lane: Lane;
  date: string;
  stack: string[];
  result: string;
  links?: { repo?: string; demo?: string };
}

interface CaseStudyProps {
  frontmatter: CaseStudyFrontmatter;
  headings: { id: string; text: string; level: number }[];
  children: React.ReactNode;
}

const laneText: Record<Lane, string> = {
  main: "text-lane-main",
  hackathon: "text-lane-hackathon",
  oss: "text-lane-oss",
  iot: "text-lane-iot",
};

const laneBorder: Record<Lane, string> = {
  main: "border-lane-main/40",
  hackathon: "border-lane-hackathon/40",
  oss: "border-lane-oss/40",
  iot: "border-lane-iot/40",
};

export default function CaseStudy({
  frontmatter: fm,
  headings,
  children,
}: CaseStudyProps) {
  const reduced = useReducedMotion();
  const r = reduced === true;

  const date = new Date(fm.date).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 md:px-16 lg:px-24">
      {/* Back link */}
      <motion.div
        className="mb-8"
        initial={r ? {} : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: DUR.fast, ease: EASE }}
      >
        <Link
          href="/#log"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-foreground"
        >
          <span>←</span> Back to log
        </Link>
      </motion.div>

      {/* Header card — styled like a PR header */}
      <motion.header
        className={`mb-12 rounded-lg border ${laneBorder[fm.lane]} bg-surface p-6`}
        initial={r ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: DUR.base, ease: EASE }}
      >
        {/* Meta line: hash + lane + date */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs text-muted">{fm.hash}</span>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-xs ${laneText[fm.lane]} border-current/20`}
          >
            {fm.lane}
          </span>
          <time className="font-mono text-xs text-muted">{date}</time>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
          {fm.title}
        </h1>
        <p className="mb-4 text-muted">{fm.summary}</p>

        {/* Stack chips */}
        {fm.stack.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {fm.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Result */}
        <p className="text-sm font-medium text-foreground">{fm.result}</p>

        {/* Repo / Demo links */}
        {fm.links && (fm.links.repo || fm.links.demo) && (
          <div className="mt-4 flex gap-4">
            {fm.links.repo && (
              <a
                href={fm.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-lane-oss hover:underline"
              >
                → Repo
              </a>
            )}
            {fm.links.demo && (
              <a
                href={fm.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-lane-oss hover:underline"
              >
                → Demo
              </a>
            )}
          </div>
        )}
      </motion.header>

      {/* Content area: MDX body + optional sidebar ToC */}
      <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
        {/* MDX content */}
        <motion.article
          className="min-w-0"
          initial={r ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: DUR.base, ease: EASE }}
        >
          {children}
        </motion.article>

        {/* Sidebar ToC — desktop only */}
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>
    </div>
  );
}
