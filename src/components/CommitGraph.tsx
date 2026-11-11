"use client";

/**
 * CommitGraph — the SVG commit-graph visualisation.
 *
 * One SVG that spans the full height of the log section and sits on
 * the left rail (desktop only). Cards live to its right with padding.
 *
 * ┌── HOW THE LAYOUT WORKS ──────────────────────────────────────────┐
 * │                                                                   │
 * │  Lane positions are computed from the `lane` field:               │
 * │    main = 40 px,  each other lane steps right by 28 px           │
 * │                                                                   │
 * │  Y positions are computed from fixed row heights that match the   │
 * │  CSS `min-h` on the card rows in CommitLog. Each commit row is    │
 * │  ROW_H px; year markers are MARKER_H px. The node sits at the    │
 * │  vertical centre of its row.                                      │
 * │                                                                   │
 * │  Fork/merge curves are cubic beziers. The two control points      │
 * │  sit at the vertical midpoint between the two nodes, keeping      │
 * │  the X of the lane each control point belongs to:                 │
 * │                                                                   │
 * │    start ─── cp1 (startX, midY) ──┐                               │
 * │                                    │  (midY)                      │
 * │    end   ─── cp2 (endX,   midY) ──┘                               │
 * │                                                                   │
 * │  This produces a smooth S-curve that leaves vertically, eases     │
 * │  sideways through the midpoint, and arrives vertically.           │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * SCROLL-DRIVEN DRAW
 *   The main trunk path and each branch curve use strokeDashoffset
 *   mapped to the section's scroll progress (via framer-motion
 *   useScroll). As you scroll down the trunk "draws" top-to-bottom,
 *   and each branch draws when its scroll range is reached.
 */

import { useRef, useEffect, useMemo, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { commits, type Commit, type Lane } from "@/data/commits";

// ── Layout constants ──────────────────────────────────────────────────

/** Lane x-positions (px) inside the SVG. main is leftmost. */
const LANE_X: Record<Lane, number> = {
  main: 40,
  hackathon: 68,
  oss: 96,
  iot: 124,
};

const NODE_RADIUS = 6;
const SVG_WIDTH = 160;

/**
 * Row heights — these MUST match the CSS min-heights on card rows
 * in CommitLog so that SVG nodes line up with their cards.
 */
export const ROW_H = 160;
export const MARKER_H = 80;

/** Stroke colours for each lane (reference the CSS custom properties). */
const LANE_STROKE: Record<Lane, string> = {
  main: "var(--lane-main)",
  hackathon: "var(--lane-hackathon)",
  oss: "var(--lane-oss)",
  iot: "var(--lane-iot)",
};

// ── Geometry helpers ──────────────────────────────────────────────────

function isYearMarker(c: Commit): boolean {
  return c.message.startsWith("tag:");
}

interface NodePos {
  commit: Commit;
  x: number;
  y: number;
}

/**
 * Compute the (x, y) position of every commit node.
 *
 * Walk the array top-to-bottom, accumulating row heights.
 * Each node sits at the vertical centre of its row and at the
 * x-offset that its lane dictates.
 */
function computeLayout(data: Commit[]): { nodes: NodePos[]; totalH: number } {
  let y = 0;
  const nodes: NodePos[] = data.map((c) => {
    const h = isYearMarker(c) ? MARKER_H : ROW_H;
    const centre = y + h / 2;
    y += h;
    return { commit: c, x: LANE_X[c.lane], y: centre };
  });
  return { nodes, totalH: y };
}

/**
 * Build a cubic-bezier SVG path string between two nodes.
 *
 * The control points keep the start and end lanes but share the
 * vertical midpoint, producing a smooth S-curve:
 *
 *   M startX,startY
 *   C startX,midY  endX,midY  endX,endY
 */
function curvedPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): string {
  const midY = (startY + endY) / 2;
  return `M ${startX},${startY} C ${startX},${midY} ${endX},${midY} ${endX},${endY}`;
}

// ── Branch-curve data ─────────────────────────────────────────────────

interface BranchCurve {
  d: string;
  lane: Lane;
  /** Fraction of totalH where the curve starts (for scroll sub-range). */
  startFrac: number;
  /** Fraction of totalH where the curve ends. */
  endFrac: number;
}

/**
 * Walk the commit list and build:
 * - trunkD: a straight vertical path through all main-lane nodes
 * - branches: an array of cubic-bezier fork/merge curves
 */
function buildPaths(nodes: NodePos[], totalH: number) {
  const byHash = new Map(nodes.map((n) => [n.commit.hash, n]));

  // Main trunk: straight line connecting all main-lane node centres
  const mainNodes = nodes.filter((n) => n.commit.lane === "main");
  const trunkD =
    mainNodes.length >= 2
      ? `M ${LANE_X.main},${mainNodes[0].y} L ${LANE_X.main},${mainNodes[mainNodes.length - 1].y}`
      : "";

  const branches: BranchCurve[] = [];

  for (const node of nodes) {
    const c = node.commit;
    if (c.lane === "main") continue;

    // Fork curve: parent (main) → this node (branch lane)
    if (c.parent) {
      const parent = byHash.get(c.parent);
      if (parent && parent.y < node.y) {
        branches.push({
          d: curvedPath(parent.x, parent.y, node.x, node.y),
          lane: c.lane,
          startFrac: parent.y / totalH,
          endFrac: node.y / totalH,
        });
      }
    }

    // Merge curve: this node (branch lane) → merge target (main)
    // Only draw if the target is BELOW this node (further in time)
    if (c.mergesInto) {
      const target = byHash.get(c.mergesInto);
      if (target && target.y > node.y) {
        branches.push({
          d: curvedPath(node.x, node.y, target.x, target.y),
          lane: c.lane,
          startFrac: node.y / totalH,
          endFrac: target.y / totalH,
        });
      }
    }
  }

  return { trunkD, branches };
}

// ── Sub-components ────────────────────────────────────────────────────

/**
 * A single branch fork/merge curve that draws on scroll.
 * Each curve has its own scroll sub-range derived from the nodes it
 * connects.
 */
function BranchPath({
  d,
  lane,
  startFrac,
  endFrac,
  scrollProgress,
  reduced,
}: BranchCurve & {
  scrollProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(200);

  // Measure the actual SVG path length after mount
  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  // Map the section's overall scroll progress to this branch's sub-range.
  // The curve starts drawing when scroll reaches startFrac and finishes
  // at endFrac.
  const dashOffset = useTransform(
    scrollProgress,
    [Math.max(0, startFrac - 0.05), endFrac + 0.05],
    [length, 0],
  );

  return (
    <motion.path
      ref={pathRef}
      d={d}
      stroke={LANE_STROKE[lane]}
      strokeWidth={2}
      fill="none"
      strokeDasharray={length}
      style={{
        strokeDashoffset: reduced ? 0 : dashOffset,
        willChange: reduced ? "auto" : "stroke-dashoffset",
      }}
    />
  );
}

/**
 * A commit node that pops in with a spring when the scroll reaches it.
 */
function CommitNode({
  x,
  y,
  lane,
  yFrac,
  scrollProgress,
  reduced,
  isActive,
}: {
  x: number;
  y: number;
  lane: Lane;
  yFrac: number;
  scrollProgress: MotionValue<number>;
  reduced: boolean;
  isActive: boolean;
}) {
  const [visible, setVisible] = useState(reduced);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    // Fire once when scroll progress passes this node's position
    if (!visible && v >= yFrac - 0.08) setVisible(true);
  });

  return (
    <g>
      {/* Glow ring on the active (nearest-viewport-centre) node */}
      {isActive && (
        <circle
          cx={x}
          cy={y}
          r={NODE_RADIUS + 6}
          fill={LANE_STROKE[lane]}
          opacity={0.15}
          style={{ filter: "blur(6px)" }}
        />
      )}

      {/* The node itself — spring scale via animated radius */}
      <motion.circle
        cx={x}
        cy={y}
        fill={LANE_STROKE[lane]}
        initial={{ r: reduced ? NODE_RADIUS : 0 }}
        animate={{ r: visible ? NODE_RADIUS : 0 }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 24 }
        }
      />
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────

interface CommitGraphProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  reduced: boolean;
}

export default function CommitGraph({ sectionRef, reduced }: CommitGraphProps) {
  const { nodes, totalH } = useMemo(() => computeLayout(commits), []);
  const { trunkD, branches } = useMemo(
    () => buildPaths(nodes, totalH),
    [nodes, totalH],
  );

  // Scroll progress for the log section.
  // 0 = section top at viewport bottom, 1 = section bottom at viewport top.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Trunk draws along the full 0–1 range
  const trunkLength = totalH;
  const trunkDashOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [trunkLength, 0],
  );

  // Track which non-marker node is nearest viewport centre for the glow
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const nonMarkerNodes = useMemo(
    () => nodes.filter((n) => !isYearMarker(n.commit)),
    [nodes],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    // Map progress to an approximate y position within the section
    const viewY = progress * totalH;
    let closest: NodePos | null = null;
    let closestDist = Infinity;
    for (const n of nonMarkerNodes) {
      const dist = Math.abs(n.y - viewY);
      if (dist < closestDist) {
        closestDist = dist;
        closest = n;
      }
    }
    if (closest) setActiveHash(closest.commit.hash);
  });

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 hidden md:block"
      width={SVG_WIDTH}
      height={totalH}
      aria-hidden="true"
    >
      {/* Main trunk line — draws top-to-bottom with scroll */}
      {trunkD && (
        <motion.path
          d={trunkD}
          stroke="var(--lane-main)"
          strokeWidth={2}
          fill="none"
          strokeDasharray={trunkLength}
          style={{
            strokeDashoffset: reduced ? 0 : trunkDashOffset,
            willChange: reduced ? "auto" : "stroke-dashoffset",
          }}
        />
      )}

      {/* Branch fork / merge curves */}
      {branches.map((b, i) => (
        <BranchPath
          key={`branch-${i}`}
          {...b}
          scrollProgress={scrollYProgress}
          reduced={reduced}
        />
      ))}

      {/* Commit nodes (year markers are excluded — they have no dot) */}
      {nonMarkerNodes.map((n) => (
        <CommitNode
          key={n.commit.hash}
          x={n.x}
          y={n.y}
          lane={n.commit.lane}
          yFrac={n.y / totalH}
          scrollProgress={scrollYProgress}
          reduced={reduced}
          isActive={n.commit.hash === activeHash}
        />
      ))}
    </svg>
  );
}
