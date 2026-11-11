"use client";

/**
 * Dependencies — skills written as a package.json block.
 *
 * Spec: grouped into languages, backend, AI, IoT and tools.
 * The block types in line-by-line when it enters the viewport
 * (each line fades in with stagger).
 */

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";

const deps: Record<string, string[]> = {
  languages: ["TypeScript", "Python", "C++", "Java"],
  backend: ["Node.js", "Express", "FastAPI", "PostgreSQL", "Supabase", "Redis"],
  ai: ["TODO(jak): add AI/ML tools"],
  iot: ["TODO(jak): add IoT platforms and hardware"],
  tools: ["Git", "Docker", "Linux", "Vercel", "GitHub Actions"],
};

/** Flatten every visible line (group headers, entries, braces) for stagger */
function buildLines() {
  const lines: { text: string; indent: number; color?: string }[] = [];
  lines.push({ text: "{", indent: 0 });

  for (const [group, skills] of Object.entries(deps)) {
    lines.push({ text: `"${group}": {`, indent: 1, color: "text-lane-main" });
    for (let i = 0; i < skills.length; i++) {
      const comma = i < skills.length - 1 ? "," : "";
      lines.push({ text: `"${skills[i]}": "*"${comma}`, indent: 2 });
    }
    lines.push({ text: "},", indent: 1 });
  }

  lines.push({ text: "}", indent: 0 });
  return lines;
}

const lines = buildLines();

export default function Dependencies() {
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced === true;

  return (
    <section id="dependencies" className="px-6 py-16 md:px-16 lg:px-24">
      <motion.h2
        className="mb-8 font-mono text-sm uppercase tracking-wider text-muted"
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: DUR.base, ease: EASE }}
      >
        Dependencies
      </motion.h2>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {/* File-tab title bar */}
        <div className="border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-muted">
            jak/package.json
          </span>
        </div>

        {/* Lines type in one by one */}
        <div className="p-6 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              style={{ paddingLeft: `${line.indent * 1.5}rem` }}
              initial={reduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={
                reduced
                  ? {}
                  : { delay: i * 0.04, duration: 0.15, ease: EASE }
              }
            >
              <span className={line.color ?? "text-foreground"}>
                {line.text}
              </span>
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
