"use client";

/**
 * Changelog / Now — what Jak is doing this month.
 *
 * Each entry fades + rises in with stagger (same pattern as section
 * headings). No fancy animation here — content speaks.
 */

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

interface ChangelogEntry {
  date: string;
  text: string;
}

const entries: ChangelogEntry[] = [
  {
    date: "Nov 2026",
    text: "Tech Core Lead, Software Wing at Anvaya (NIE-IUCEE Student Chapter)",
  },
  {
    date: "2026",
    text: "TODO(jak): what you're learning right now",
  },
  {
    date: "2026",
    text: "Open to internships — backend, systems, or IoT",
  },
];

export default function Changelog() {
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced === true;

  return (
    <section id="changelog" className="px-6 py-16 md:px-16 lg:px-24">
      <motion.h2
        className="mb-8 font-mono text-sm uppercase tracking-wider text-muted"
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: DUR.base, ease: EASE }}
      >
        Changelog / now
      </motion.h2>

      <ul className="space-y-6">
        {entries.map((entry, i) => (
          <motion.li
            key={i}
            className="flex gap-4"
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.06,
              duration: DUR.base,
              ease: EASE,
            }}
          >
            <time className="mt-0.5 w-24 flex-shrink-0 font-mono text-xs text-muted">
              {entry.date}
            </time>
            <p className="text-foreground">{entry.text}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
