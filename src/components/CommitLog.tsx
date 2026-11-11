"use client";

/**
 * The Log — the main commit graph section.
 *
 * Layout (desktop):
 *   ┌─────────┬──────────────────────────────────┐
 *   │  SVG    │  Commit cards                     │
 *   │  graph  │  (fade + rise 24 px on scroll)    │
 *   │  160 px │                                   │
 *   └─────────┴──────────────────────────────────┘
 *
 * The SVG graph (CommitGraph) sits absolute-left, and the cards are
 * pushed right with md:pl-44. Row min-heights match the constants
 * exported from CommitGraph so that SVG nodes line up with cards.
 *
 * PLAIN MODE: graph hidden, cards full-width, crossfade via opacity.
 */

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { commits, type Commit, type Lane } from "@/data/commits";
import { EASE, DUR } from "@/lib/motion";
import { usePlainMode } from "@/lib/plain-mode";
import CommitGraph, { ROW_H, MARKER_H } from "@/components/CommitGraph";

// ── Lane colour classes ───────────────────────────────────────────────

const laneAccent: Record<Lane, string> = {
  main: "bg-lane-main",
  hackathon: "bg-lane-hackathon",
  oss: "bg-lane-oss",
  iot: "bg-lane-iot",
};

const laneText: Record<Lane, string> = {
  main: "text-lane-main",
  hackathon: "text-lane-hackathon",
  oss: "text-lane-oss",
  iot: "text-lane-iot",
};

// ── Helpers ───────────────────────────────────────────────────────────

function isYearMarker(c: Commit): boolean {
  return c.message.startsWith("tag:");
}

// ── Sub-components ────────────────────────────────────────────────────

function YearMarker({ commit }: { commit: Commit }) {
  const label = commit.message.replace("tag: ", "");
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center rounded-full border border-lane-main/40 bg-lane-main/10 px-3 py-1 font-mono text-xs font-semibold text-lane-main">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function CommitCard({
  commit,
  reduced,
}: {
  commit: Commit;
  reduced: boolean;
}) {
  const date = new Date(commit.date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
  const hasStudy = !!commit.caseStudy;

  const card = (
    <motion.article
      className={`group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border/80 ${hasStudy ? "cursor-pointer" : ""}`}
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DUR.base, ease: EASE }}
      aria-label={`${commit.message} — ${commit.result}`}
    >
      {/* Header: message + hash */}
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <p className={`font-medium ${laneText[commit.lane]}`}>
          {commit.message}
        </p>
        <span className="font-mono text-xs text-muted">{commit.hash}</span>
      </div>

      {/* Date + lane tag */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <time dateTime={commit.date} className="font-mono">
          {date}
        </time>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono ${laneText[commit.lane]} border-current/20`}
        >
          {commit.lane}
        </span>
      </div>

      {/* Result */}
      <p className="mb-3 text-sm text-muted">{commit.result}</p>

      {/* Stack chips */}
      {commit.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {commit.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Case study link indicator */}
      {hasStudy && (
        <div className="mt-3 font-mono text-xs text-lane-main">
          → Read case study
        </div>
      )}
    </motion.article>
  );

  if (hasStudy) {
    return (
      <Link href={`/case-studies/${commit.caseStudy}`} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

// ── Main component ────────────────────────────────────────────────────

export default function CommitLog() {
  const sectionRef = useRef<HTMLElement>(null);
  const { plain } = usePlainMode();
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced === true;

  return (
    <section
      ref={sectionRef}
      id="log"
      className="relative px-6 py-16 md:px-16 lg:px-24"
    >
      <h2 className="mb-8 font-mono text-sm uppercase tracking-wider text-muted">
        git log --graph
      </h2>

      {/* Dot-grid background (spec: faint texture behind the graph) */}
      <div className="dot-grid pointer-events-none absolute inset-0" />

      <AnimatePresence mode="wait">
        {plain ? (
          /* ── Plain list (no graph) ─────────────────────────────── */
          <motion.div
            key="plain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE }}
            className="relative space-y-4"
          >
            {commits
              .filter((c) => !isYearMarker(c))
              .map((c) => (
                <CommitCard key={c.hash} commit={c} reduced={reduced} />
              ))}
          </motion.div>
        ) : (
          /* ── Graph view ────────────────────────────────────────── */
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE }}
            className="relative"
          >
            {/* SVG graph (desktop only) */}
            <CommitGraph sectionRef={sectionRef} reduced={reduced} />

            {/* Card list — mobile: rail border on left; desktop: padded for SVG graph */}
            <div className="border-l-2 border-lane-main/20 pl-6 md:border-l-0 md:pl-44">
              {commits.map((c) => (
                <div
                  key={c.hash}
                  className="relative flex items-center"
                  style={{
                    minHeight: isYearMarker(c) ? MARKER_H : ROW_H,
                  }}
                >
                  {/* Mobile-only lane dot — sits on the left rail border */}
                  {!isYearMarker(c) && (
                    <div
                      className={`absolute -left-[7px] h-3 w-3 rounded-full md:hidden ${laneAccent[c.lane]}`}
                    />
                  )}

                  <div className="flex-1">
                    {isYearMarker(c) ? (
                      <YearMarker commit={c} />
                    ) : (
                      <CommitCard commit={c} reduced={reduced} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
