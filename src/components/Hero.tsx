"use client";

/**
 * Hero — "HEAD -> main"
 *
 * Spec: A prompt types `git log --graph jak`, then name, one-line bio,
 * and three buttons: Resume, GitHub, Email. A tag beside the name reads
 * "HEAD: currently building …".
 *
 * TYPING ANIMATION
 *   The full text is rendered server-side (it IS the LCP element).
 *   A covering div slides right via translateX to reveal it, giving a
 *   typing effect while only animating transform (GPU-composited).
 *   40 ms per character × 21 chars = 840 ms.
 *
 * STAGGER
 *   Name, HEAD tag, bio, and buttons fade up 16 px with 60 ms stagger,
 *   overlapping the tail of the typing so everything lands within ~900 ms.
 *
 * REDUCED MOTION
 *   Everything renders in its final position immediately.
 */

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Stagger items: 500 ms base delay + 60 ms between each */
function stagger(index: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.5 + index * 0.06, duration: 0.25, ease: EASE },
  };
}

const PROMPT = "$ git log --graph jak";
const TYPING_DURATION = PROMPT.length * 0.04; // ~0.84 s

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center px-6 py-24 md:px-16 lg:px-24"
    >
      {/* ── Terminal prompt with typing reveal ────────────────────── */}
      <div className="relative mb-8 inline-block self-start overflow-hidden">
        <p className="font-mono text-sm text-muted">
          <span className="text-lane-main">$</span> git log --graph jak
        </p>
        {/* Covering div slides right to reveal the text (transform only) */}
        {!reduced && (
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ x: "0%" }}
            animate={{ x: "101%" }}
            transition={{ duration: TYPING_DURATION, ease: "linear" }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Name + HEAD tag ──────────────────────────────────────── */}
      <motion.div
        className="mb-4 flex flex-wrap items-baseline gap-3"
        {...(reduced ? {} : stagger(0))}
      >
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">Jak</h1>
        {/* TODO(jak): update HEAD tag when a current project is in progress */}
        <span className="rounded-full border border-lane-main/40 bg-lane-main/10 px-3 py-0.5 font-mono text-xs text-lane-main">
          HEAD
        </span>
      </motion.div>

      {/* ── One-liner bio ────────────────────────────────────────── */}
      <motion.p
        className="mb-8 max-w-xl text-lg text-muted"
        {...(reduced ? {} : stagger(1))}
      >
        2nd-year CSE at NIE. I ship backend systems, agents and IoT, mostly at
        hackathons.
      </motion.p>

      {/* ── CTA buttons (visible before any animation finishes) ─── */}
      <motion.div
        className="flex flex-wrap gap-4"
        {...(reduced ? {} : stagger(2))}
      >
        <a
          href="#" // TODO(jak): link to your resume PDF
          className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-lane-main hover:text-lane-main"
        >
          Resume
        </a>
        <a
          href="https://github.com/Jakmaroli"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-lane-main hover:text-lane-main"
        >
          GitHub
        </a>
        <a
          href="mailto:akumarjanaki@gmail.com"
          className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-lane-main hover:text-lane-main"
        >
          Email
        </a>
      </motion.div>
    </section>
  );
}
