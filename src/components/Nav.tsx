"use client";

/**
 * Nav — sticky HEAD indicator and --no-graph toggle.
 *
 * The HEAD indicator shows which section is currently in view,
 * updating via IntersectionObserver as you scroll. The toggle
 * switches between the graph view and a plain list.
 */

import { useEffect, useState } from "react";
import { usePlainMode } from "@/lib/plain-mode";

const SECTIONS = [
  "hero",
  "pinned",
  "log",
  "contributions",
  "dependencies",
  "changelog",
  "contact",
] as const;

export default function Nav() {
  const { plain, toggle } = usePlainMode();
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    // Track which section occupies the most viewport area
    const observers: IntersectionObserver[] = [];

    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.3 },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="fixed right-4 top-4 z-50 flex items-center gap-2">
      {/* HEAD indicator */}
      <span className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-lane-main backdrop-blur-sm">
        HEAD → {active}
      </span>

      {/* --no-graph / --graph toggle */}
      <button
        onClick={toggle}
        className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-muted backdrop-blur-sm transition-colors hover:text-foreground"
        aria-pressed={plain}
        title={plain ? "Show graph view" : "Show plain list"}
      >
        {plain ? "--graph" : "--no-graph"}
      </button>
    </nav>
  );
}
