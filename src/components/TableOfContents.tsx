"use client";

/**
 * Sidebar table of contents for case study pages.
 *
 * Uses IntersectionObserver to highlight the heading closest to
 * the top of the viewport. Sticky-positioned so it scrolls with
 * the content.
 */

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border pl-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block font-mono text-xs transition-colors ${
                h.level === 3 ? "pl-3" : ""
              } ${
                activeId === h.id
                  ? "text-lane-main"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
