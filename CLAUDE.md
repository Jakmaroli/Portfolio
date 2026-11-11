# CLAUDE.md — Jak's portfolio ("git log --life")

## What we are building
A personal portfolio for Jak, 2nd-year CSE at NIE, drawn as a git commit graph.
Scrolling walks the log. `main` is the timeline; each project is a coloured
branch that forks off and merges back. Clicking a commit opens a PR-style
case study at `/commit/[hash]`.

Full design spec (layout, colours, every animation and its timing):
https://claude.ai/artifact/6TdA828p5YQp99mHt1Ya2v
Treat the spec as the source of truth. If something here conflicts with it, ask.

## Stack (fixed — do not add to it without asking)
- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui (form, buttons only)
- Motion (framer-motion) for all animation, incl. `useScroll` for the graph
- Lenis for smooth scroll
- MDX for case studies
- NO Three.js, R3F, postprocessing, GSAP, video backgrounds, custom cursors, loaders
- Deploy target: Vercel

## Data
- `src/data/commits.ts` is the single source for the graph. Shape:
  ```ts
  type Commit = {
    hash: string;          // 7 chars, shown in UI and used in the URL
    message: string;       // "feat: FloodLane flood-risk routes for Mangaluru"
    date: string;          // ISO
    lane: "main" | "hackathon" | "oss" | "iot";   // decides colour
    parent?: string;       // hash it forks from
    mergesInto?: string;   // hash it merges back into
    pinned?: boolean;      // top-3 cards in the hero
    stack: string[];
    result: string;        // one line, real numbers only
    caseStudy?: string;    // slug of the MDX file
    links?: { repo?: string; demo?: string };
  };
  ```
- Fork/merge curves are COMPUTED from parent/mergesInto. Never hand-place SVG paths.
- GitHub heatmap + merged PRs: a build-time script (`scripts/sync-github.ts`)
  writes `src/data/github.json`; the page reads that JSON, so the site works
  offline and never calls the API from the browser.
- Never invent metrics, dates, or project details. If content is missing,
  leave a clearly marked `TODO(jak):` placeholder and tell me.

## Reference repos — ideas only, do not copy code
Two seniors' portfolios. Neither repo has a LICENSE file, so their code is
all-rights-reserved: read them for structure and ideas, write our own code.
- aayush2724/Portfolio (Vite, React 18, Three.js, ~56 components, Python
  backend for an AI assistant). Take the IDEAS of: a build-time data sync
  script, a docs/ folder, tests + lint in a `check` script. Avoid its weight.
- simba12-gif/portfolio (Vite, React 19, Tailwind 4, framer-motion only).
  Take the IDEA of: one data file driving every section, tiny dependency list.

## Rules
- Performance: LCP < 2 s on mid-range mobile; first-load JS < ~200 KB.
- `prefers-reduced-motion`: skip all animation, render the final state.
- Mobile: graph collapses to one rail on the left; branches become inline tags.
- Plain view: `--no-graph` toggle in nav and `?plain` URL param → simple list.
- Keyboard: commit nodes focusable, Enter opens case study, arrows move along graph.
- Accessibility: real text for everything, alt text, contrast AA.
- Resume link, GitHub, email visible in the first screen, before animations finish.

## Workflow
- Build in this order: static layout with real content → graph component →
  case-study pages + transition → remaining motion, mobile, reduced-motion pass.
- After each stage: run `npm run lint && npm run build`, then stop and show me.
- Small commits with conventional messages (feat:, fix:, style:, chore:).
- NEVER add `Co-Authored-By: Claude`, "Generated with Claude Code", or any
  similar attribution line to commits or PRs.
- Explain any non-obvious code (especially the graph layout math) in comments —
  I need to be able to explain it in interviews.
