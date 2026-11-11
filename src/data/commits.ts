/**
 * commits.ts — single source of truth for the commit graph.
 *
 * Every project is a commit. The `lane` decides its colour. `parent` and
 * `mergesInto` tell the graph component where to draw fork/merge curves
 * (those curves are COMPUTED, never hand-placed).
 *
 * The three `pinned: true` commits appear in the hero's pinned-repos section.
 */

export type Lane = "main" | "hackathon" | "oss" | "iot";

export interface Commit {
  hash: string;           // 7 chars, shown in the UI and used in the URL
  message: string;        // conventional-commit style
  date: string;           // ISO 8601
  lane: Lane;
  parent?: string;        // hash of the commit this one forks from
  mergesInto?: string;    // hash of the commit this one merges back into
  pinned?: boolean;       // true for the top-3 cards in the hero
  stack: string[];
  result: string;         // one line — real numbers only, no fakes
  caseStudy?: string;     // slug that maps to an MDX file in /content
  links?: { repo?: string; demo?: string };
}

/** Lane → colour (mirrors the CSS custom properties) */
export const laneColors: Record<Lane, string> = {
  main: "var(--lane-main)",
  hackathon: "var(--lane-hackathon)",
  oss: "var(--lane-oss)",
  iot: "var(--lane-iot)",
};

/** Human-readable lane labels */
export const laneLabels: Record<Lane, string> = {
  main: "main",
  hackathon: "hackathon",
  oss: "open-source",
  iot: "iot",
};

// ── Timeline commits (newest first) ──────────────────────────────────

export const commits: Commit[] = [
  // ── v2026 ──────────────────────────────────────────────────────────
  {
    hash: "a1b2c3d",
    message: "tag: v2026",
    date: "2026-01-01T00:00:00Z",
    lane: "main",
    stack: [],
    result: "Year marker",
  },

  // Anvaya / Tech Ride
  {
    hash: "b7a8c9d",
    message: "feat: Tech Ride — multi-round game for Anvaya (NIE-IUCEE)",
    date: "2026-01-15T00:00:00Z",  // TODO(jak): real date
    lane: "hackathon",
    parent: "a1b2c3d",
    mergesInto: "a1b2c3d",
    stack: ["Express", "React", "Vite", "Supabase", "PostgreSQL"],
    result: "TODO(jak): registrations, participants or rounds — one real number",
    caseStudy: "tech-ride",
    links: {
      // TODO(jak): club website URL if live
    },
  },

  // ── v2025 ──────────────────────────────────────────────────────────
  {
    hash: "e1f2a3b",
    message: "tag: v2025",
    date: "2025-01-01T00:00:00Z",
    lane: "main",
    stack: [],
    result: "Year marker",
  },

  // LeadForge — unpinned placeholder, not built yet
  {
    hash: "d5e6f7a",
    message: "feat: LeadForge — TODO(jak): one-line description",
    date: "2025-06-01T00:00:00Z",  // TODO(jak): real date
    lane: "hackathon",
    parent: "e1f2a3b",
    mergesInto: "e1f2a3b",
    pinned: false,
    stack: ["TODO(jak): stack"],
    result: "TODO(jak): one real number/result",
    caseStudy: "leadforge",
    links: {
      // TODO(jak): repo and demo URLs
    },
  },

  // TODO(jak): add more commits here — OSS contributions, IoT projects, etc.
  // Each one needs: hash (7 chars), message, date, lane, stack, result.
  // Set parent/mergesInto to the year-marker hash the project belongs to.
];

/** Helper: get pinned commits (for the hero section) */
export function getPinnedCommits(): Commit[] {
  return commits.filter((c) => c.pinned);
}

/** Helper: get commits by lane */
export function getCommitsByLane(lane: Lane): Commit[] {
  return commits.filter((c) => c.lane === lane);
}
