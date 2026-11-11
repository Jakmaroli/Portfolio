"use client";

/**
 * Contributions — GitHub heatmap + merged PRs.
 *
 * HEATMAP ANIMATION: cells fade in on a diagonal wave from top-left,
 * 8 ms stagger per cell. The diagonal index is (row + col), so cells
 * along the same diagonal appear together.
 *
 * Stage 2: placeholder data. The real heatmap data arrives when
 * scripts/sync-github.ts is wired up in a later stage.
 */

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

const COLS = 52; // weeks
const ROWS = 7; // days

export default function Contributions() {
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced === true;

  return (
    <section id="contributions" className="px-6 py-16 md:px-16 lg:px-24">
      <motion.h2
        className="mb-8 font-mono text-sm uppercase tracking-wider text-muted"
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: DUR.base, ease: EASE }}
      >
        Contributions
      </motion.h2>

      {/* Heatmap placeholder */}
      <div className="mb-10 rounded-lg border border-border bg-surface p-6">
        <p className="mb-4 text-sm text-muted">GitHub contribution heatmap</p>

        {/* Diagonal-wave fade-in: delay = (row + col) * 8 ms */}
        <div className="overflow-x-auto">
          <div
            className="grid min-w-[640px] gap-[3px]"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {Array.from({ length: COLS * ROWS }).map((_, i) => {
              const row = i % ROWS; // CSS grid fills column-first
              const col = Math.floor(i / ROWS);
              const delay = (row + col) * 0.008;

              return (
                <motion.div
                  key={i}
                  className="aspect-square w-full rounded-sm bg-lane-main/10"
                  initial={reduced ? {} : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={
                    reduced
                      ? {}
                      : { delay, duration: 0.2, ease: EASE }
                  }
                />
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted">
          TODO(jak): wire up scripts/sync-github.ts to populate
          src/data/github.json
        </p>
      </div>

      {/* Merged PRs */}
      <div>
        <h3 className="mb-4 font-mono text-sm text-muted">
          Merged into other repos
        </h3>
        <ul className="space-y-3">
          {/* TODO(jak): fill with real merged PRs */}
          <motion.li
            className="flex items-start gap-3 text-sm"
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-lane-oss" />
            <span className="text-muted">
              TODO(jak): Hacktoberfest / Mergetober / GSoC prep PR details
            </span>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}
