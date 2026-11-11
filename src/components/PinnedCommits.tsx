"use client";

/**
 * Pinned Commits — the three best projects as cards.
 *
 * Spec: styled like GitHub pinned repos — name, one-line result,
 * stack chips, branch colour.
 *
 * HOVER: perspective(800px) on the parent, translateY(-6px) rotateX(2deg)
 * on the card, border turns lane colour. 200 ms. This is the only "3D"
 * effect on the site — CSS transforms only, no Three.js.
 */

import { motion, useReducedMotion } from "framer-motion";
import { getPinnedCommits, type Commit, type Lane } from "@/data/commits";
import { EASE, DUR } from "@/lib/motion";

/** Tailwind classes for the left-border accent per lane */
const laneBorderClass: Record<Lane, string> = {
  main: "border-l-lane-main",
  hackathon: "border-l-lane-hackathon",
  oss: "border-l-lane-oss",
  iot: "border-l-lane-iot",
};

/** Hover border colour (CSS variable) per lane */
const laneVar: Record<Lane, string> = {
  main: "var(--lane-main)",
  hackathon: "var(--lane-hackathon)",
  oss: "var(--lane-oss)",
  iot: "var(--lane-iot)",
};

function PinnedCard({
  commit,
  index,
  reduced,
}: {
  commit: Commit;
  index: number;
  reduced: boolean;
}) {
  const name = commit.message.replace(/^.*?:\s*/, "").split("—")[0].trim();

  return (
    // Perspective wrapper — gives the card depth on hover
    <div style={{ perspective: reduced ? "none" : "800px" }}>
      <motion.article
        className={`flex flex-col gap-3 rounded-lg border border-border bg-surface p-5
          border-l-4 ${laneBorderClass[commit.lane] ?? "border-l-lane-main"}`}
        // Fade + rise on enter
        initial={reduced ? {} : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          delay: index * 0.08,
          duration: DUR.base,
          ease: EASE,
        }}
        // 3D lift on hover (translateY + rotateX via transform)
        whileHover={
          reduced
            ? {}
            : {
                y: -6,
                rotateX: 2,
                borderColor: laneVar[commit.lane],
                transition: { duration: 0.2 },
              }
        }
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-muted">
            {commit.hash}
          </span>
        </div>

        <p className="text-sm text-muted">{commit.result}</p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {commit.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

export default function PinnedCommits() {
  const reduced = useReducedMotion();
  const pinned = getPinnedCommits();

  if (pinned.length === 0) return null; // nothing pinned yet

  return (
    <section id="pinned" className="px-6 py-16 md:px-16 lg:px-24">
      <h2 className="mb-8 font-mono text-sm uppercase tracking-wider text-muted">
        Pinned
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pinned.map((c, i) => (
          <PinnedCard
            key={c.hash}
            commit={c}
            index={i}
            reduced={reduced === true}
          />
        ))}
      </div>
    </section>
  );
}
